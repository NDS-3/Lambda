const axios = require("axios");
const MONITORING_CHANNEL = process.env.SLACK_URL;

const createMessage = (cloudWatchEvents) => {
  let { Timestamp, Message, Type } = cloudWatchEvents;

  let triggerDate = new Date(Timestamp);
  triggerDate.setHours(triggerDate.getHours() + 9);

  Message = JSON.parse(Message);
  const { Trigger } = Message;

  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: Type,
          emoji: true,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "plain_text",
            text:
              "발생 시각: " +
              triggerDate.toLocaleDateString("ko-KR") +
              " " +
              triggerDate.toLocaleTimeString("ko-KR"),
            emoji: true,
          },
        ],
      },
      {
        type: "divider",
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*해당서버:* \n > ${Message.AlarmName.split("/")[1]}`,
          },
          {
            type: "mrkdwn",
            text: `*기준: * \n > ${Trigger.Threshold} ${Trigger.Unit}`,
          },
          {
            type: "mrkdwn",
            text: `*지표: * \n > ${Trigger.MetricName}`,
          },
          {
            type: "mrkdwn",
            text: "*현재: (개 포인트)* \n > ",
          },
          {
            type: "mrkdwn",
            text: `*이벤트: * \n > ${Message.NewStateReason}`,
          },
        ],
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
          url: "https://google.com",
          action_id: "button-action",
        },
      },
    ],
  };
};

const sendMessage = async (message) => {
  const headers = {
    "Content-type": "Content-type: application/json",
  };
  console.log(createMessage(message));

  return await axios.post(MONITORING_CHANNEL, createMessage(message), {
    headers,
  });
};

module.exports = { sendMessage };