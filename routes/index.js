var express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
var isFreelancer
var router = express.Router();

//var db = require('../dbconnection');

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { title: '내 정보', user: req.user,  isFreelancer: req.user.isFreelancer});
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', {
    title: '회원가입 - NodeBird',
    user: req.user,
    joinError: req.flash('joinError'),
  });
});

router.get('/', (req, res, next) => {
  console.log(req.user);

  if(req.user) {
    res.render('main', {
      title: 'NodeBird',
      user: req.user,
      loginError: req.flash('loginError'),
      isFreelancer: req.user.isFreelancer
    });
  }
  else {
    res.render('main', {
      title: 'NodeBird',
      user: req.user,
      loginError: req.flash('loginError'),
      isFreelancer: null
    });
  }
});

module.exports = router;
