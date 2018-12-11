const local = require('./localStrategy');
const mysql = require('mariadb');

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
  passport.serializeUser((user, done) => {
    done(null, user);

  });

  passport.deserializeUser(async (user, done) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const [exUser] = await conn.query(`SELECT * FROM USER WHERE id = ?`, user.id);
      if (exUser) {
        await done(null, exUser);
      }
    }
    catch (error) {
      await done(error);
    } finally {
      if (conn) conn.end();
    }


  });
  local(passport);
};
