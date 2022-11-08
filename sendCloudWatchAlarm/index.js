const zlib = require("zlib");
const { createMessage, sendMessage } = require('./slack-message');

exports.handler = async (event) => {
  if (event.awslogs && event.awslogs.data) {
    const payload = Buffer.from(event.awslogs.data, "base64");

    const cloudWatchEvents = JSON.parse(zlib.unzipSync(payload));
    const message = createMessage(cloudWatchEvents);

    await sendMessage(message);
  }

  return;
};
