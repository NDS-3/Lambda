const mysql = require('mysql2/promise');

const config = {
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DATABASE
};

const connection = await mysql.createConnection(config);

exports.handler = async (event) => {

    const { email, name } = event.request.userAttributes;
    const sql = `INSERT INTO owners(email, username) VALUES('${email}', '${name}')`;

    await connection.execute(sql);

    return {
        "message": "User Created"
    }
};
