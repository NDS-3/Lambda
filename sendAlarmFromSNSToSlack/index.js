const { sendMessage } = require("./slack-message");

exports.handler = async (event) => {
  let responseSuccessCounts = 0;
  let responseFailCounts = 0;

  event.Records.map(async (record) => {
    const response = await sendMessage(record.Sns);

    if (response.status == "200") {
      responseSuccessCounts += 1;
    } else {
      responseFailCounts += 1;
    }
  });

  return {
    result: {
      success: responseSuccessCounts,
      fail: responseFailCounts,
    },
  };
};
