const axios = require("axios");
const zlib = require("zlib");
const MONITORING_CHANNEL =
  "https://hooks.slack.com/services/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";

const createButtonURL = (logGroupName, logStreamName) => {
  return `https://${process.env.AWS_REGION}.console.aws.amazon.com/cloudwatch/home?region=${process.env.AWS_REGION}#logsV2:log-groups/log-group/${logGroupName.replace(
    /\//g,
    "$252F"
  )}/log-events/${logStreamName
    .replace("$", "$2524")
    .replace("[", "$255B")
    .replace("]", "$255D")
    .replace(/\//g, "$252F")}`;
};

const createMessage = (cloudWatchEvents) => {
  console.log(cloudWatchEvents);
  const { logGroup, logStream, logEvents } = cloudWatchEvents;
const currentDate = new Date();
const logGroupList = logGroup.split('/');

  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `${logGroupList[logGroupList.length - 1]} 빌드 실패`,
          emoji: true,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "plain_text",
            text: "발생 시각: " + currentDate.toLocaleDateString('ko-KR') + ' ' + currentDate.toLocaleTimeString('ko-KR'),
            emoji: true,
          },
        ],
      },
      {
        type: "divider",
      },
      {
        type: "section",
        fields: logEvents.map(logEvent => {
            return {
                type: "mrkdwn",
                text: `메시지: ${logEvent.message}`
            }
        })
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: " ",
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "로그 보러가기",
            emoji: true,
          },
          value: "click_me_123",
          url: createButtonURL(logGroup, logStream),
          action_id: "button-action",
        },
      },
    ],
  };
};

const sendMessage = (message) => {
  const headers = {
    "Content-type": "Content-type: application/json",
  };

  return axios.post(MONITORING_CHANNEL, message, { headers });
};

exports.handler = async (event) => {
  if (event.awslogs && event.awslogs.data) {
    const payload = Buffer.from(event.awslogs.data, "base64");

    const logevents = JSON.parse(zlib.unzipSync(payload).toString()).logEvents;
    const message = createMessage(logevents);
    await sendMessage(message);
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!"),
  };
  return response;
};
