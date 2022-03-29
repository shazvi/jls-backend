import mysql from 'mysql';
import * as dotenv from 'dotenv'
dotenv.config();

const db_config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
};

export let db = mysql.createConnection(db_config);

db.on("error", err => {
    console.log(err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
        db = mysql.createConnection(db_config);
    } else {
        throw err;
    }
});
