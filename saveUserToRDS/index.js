const mysql = require('mysql');

const con = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DATABASE
});

exports.handler = async (event) => {

    const { email, name } = event.request.userAttributes;
    const sql = `INSERT INTO owners(email, username) VALUES('${email}', '${name}')`;

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(`${name} Created`);
    });

    return {
        "message": "User Created"
    }
};
