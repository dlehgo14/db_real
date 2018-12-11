const mysql = require('mysql2/promise');
const dbConfig = require('./config/db_config');
const config = {
  host: "freelancerdb.cylylp9zpr9z.ap-southeast-1.rds.amazonaws.com",
  user: "master",
  password: "gkrwjawh",
  port: 3306,
  database: "headhunting_site"
};

 console.log(dbConfig);

const pool = mysql.createPool(config);

async function main() {
  // get the client
  // create the connection
  const connection = await pool.getConnection(async conn => conn);

  // query database
  const [rows, fields] = await connection.query('show databases');
  console.log(rows);
  connection.release();
  return 1;
}

main();


/*
var mysql=require('mysql');
var connection=mysql.createConnection({
  host: "freelancerdb.cylylp9zpr9z.ap-southeast-1.rds.amazonaws.com",
  user: "master",
  password: "gkrwjawh",
  port: 3306,
  database: "headhunting_site"
});

connection.connect(function(err) {
  if (err) {
    console.log('connecting error');
    return;
  }
  console.log('connecting success');
});

module.exports=connection;
*/

