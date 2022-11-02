const  { SNSClient } = require("@aws-sdk/client-sns");

const REGION = process.env.REGION;

const snsClient = new SNSClient({ region: REGION });

module.exports = { snsClient };
