const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const mysql = require('mariadb');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const dbConfig = require('../config/db_config');

const crypto = require('crypto');
//const cipher = crypto.createCipher('aes-256-cbc', process.env.CIPHER_KEY);

//const db = require('../dbconnection');
//const { User } = require('../models');
const router = express.Router();

const pool = mysql.createPool(
  {
    host: "freelancerdb.cylylp9zpr9z.ap-southeast-1.rds.amazonaws.com",
    user: "master",
    password: "gkrwjawh",
    port: 3306,
    database: "headhunting_site"
  }
);


function myFunction(str) {
  var arr = [];
  var perLang = str.split(",");

  for(var i=0; i<perLang.length; i++) {
    var trimed = perLang[i].trim();
    trimedArr = trimed.split("=");
    arr.push([trimedArr[0].trim(), parseInt(trimedArr[1].trim())]);
  }
  return arr;
}

router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const {id, password, name, age, phone, career, major, languageskill, isfreelancer} = req.body;

  let conn;
  try {
    conn = await pool.getConnection();
    const [exUser] = await conn.query(`SELECT * FROM USER WHERE id = ?`, id);

    if (exUser) {
      conn.end();
      req.flash('joinError', '이미 가입된 아이디입니다.');
      return res.redirect('/join');
    }
    //const hash = await bcrypt.hash(password, 12);
    result = crypto.createHash('sha512').update(password).digest('base64');
    //let result = await cipher.update(password, 'utf8', 'base64');
    //result += cipher.final('base64');

    if (isfreelancer) {
      var langSkill;
      langSkill = myFunction(languageskill);
      console.log(languageskill);
      console.log(langSkill);
      numLang = langSkill;

      try {
        await conn.query(`INSERT INTO USER (id, pw, name, age, phone, career, major, isFreelancer) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [id, result, name, age, phone, career, major, 1]);
        for(var i=0;i<numLang; i++) {
          await conn.query(`INSERT INTO LANGUAGESKILL (freelancerId, languageName, skill) VALUES (?,?,?)`, [id, langSkill[i][0], langSkill[i][1]]);
        }
      } catch (error) {
        console.error(error);
        return next(error);
      }
    }
    else {
      try {
        await conn.query(`INSERT INTO USER (id, pw, name, age, phone, career, major, isFreelancer) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [id, result, name, age, phone, -1, '', 0]);
      } catch (error) {
        console.error(error);
        return next(error);
      }
    }

    return res.redirect('/');
  }
  catch (error) {

    console.error(error);
    return next(error);
  }
  finally {
    if (conn) conn.end();
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      req.flash('loginError', info.message);
      return res.redirect('/');
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
