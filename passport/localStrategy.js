const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mysql = require('mariadb');
const dbConfig = require('../config/db_config');
//var db = require('../dbconnection');
//const { User } = require('../models');

const crypto = require('crypto');
//const decipher = crypto.createCipher('aes-256-cbc', process.env.CIPHER_KEY);
const pool = mysql.createPool(
  {
    host: "freelancerdb.cylylp9zpr9z.ap-southeast-1.rds.amazonaws.com",
    user: "master",
    password: "gkrwjawh",
    port: 3306,
    database: "headhunting_site"
  }
);



module.exports = (passport) => {
  passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'password',
  }, async (id, password, done) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const [exAdmin] = await conn.query(`SELECT * FROM ADMIN WHERE id = ?`, id);
      console.log(exAdmin);
      if (exAdmin) {
        conn.end();
        const result = (password == exAdmin.password);
        if (result) {
          done(null, exAdmin);
        }
        else {
          done(null, false, {
            message: '비밀번호가 틀렸습니다'
          });
        }
      }

      else { // Normal users
        const [exUser] = await conn.query(`SELECT * FROM USER WHERE id = ?`, [id]);


        if(exUser) {
          //let result2 = await decipher.update(exUser.pw, 'base64', 'utf8');
          //result2 += decipher.final('utf8');
          var result2 = crypto.createHash('sha512').update(password).digest('base64');
          console.log(result2);
          console.log(exUser.pw);
          console.log(exUser.isFreelancer);
          if(exUser.isFreelancer) {console.log('asfwefqwfasdf');}
          var match = result2.includes(exUser.pw);
          //const result = await bcrypt.compare(password, exUser.Pw);
          if(match) {
            done(null, exUser);
          }
          else {
            done(null, false, {
              message: '비밀번호가 틀렸습니다'
            });
          }
        }
        else {
          done(null, false, {
            message: '등록되지 않은 사용자입니다'
          });
        }
      }
    } catch (error) {

      console.error(error);
      done(error);
    } finally {
      if(conn) conn.end();
    }
  }));
};
