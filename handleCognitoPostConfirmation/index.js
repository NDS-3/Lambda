const mysql = require('mysql2/promise');
const { SubscribeCommand } = require("@aws-sdk/client-sns");
const { snsClient } = require("./snsClient.js");

const config = {
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DATABASE
};

const saveCognitoUserToRDS = async (event) => {
    const connection = await mysql.createConnection(config);

    const { email, name } = event.request.userAttributes;
    const sql = `INSERT INTO owners(email, username) VALUES('${email}', '${name}')`;

    await connection.execute(sql);
}

const getSubscritionParams = (event) => {
    return {
        Protocol: "email",
        TopicArn: process.env.HALLOWEEN_TOPIC_ARN,
        Endpoint: event.request.userAttributes.email,
    }
}

const createSubscription = async (params) => {
  try {
    const data = await snsClient.send(new SubscribeCommand(params));
    console.log("Success.",  data);
  } catch (err) {
    console.log("Error", err.stack);
  }
};

exports.handler = async (event) => {
    await saveCognitoUserToRDS(event);
    
    const params = getSubscritionParams(event);
    await createSubscription(params)
    
    return {
        "message": "Completed"
    }
};