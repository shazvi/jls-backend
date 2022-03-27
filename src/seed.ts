const dotenv = require('dotenv');
const mysql = require('mysql');
const fs = require('fs');
dotenv.config();

const coreProducts = fs.readFileSync("./seeds/seed_core_product.sql").toString();
const stocks = fs.readFileSync("./seeds/seed_stock.sql").toString();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: true
});

connection.query(coreProducts, () => {
    connection.query(stocks, () => {
        connection.end();
    });
});

