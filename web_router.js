/*!
 * nodeclub - route.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var express = require('express');
var sign = require('./controllers/sign');
var main = require('./controllers/main');
var chat = require('./controllers/chat')

var auth = require('./commons/auth');

var router = express.Router();

//显示注册页
router.get('/signup',sign.showSignup) ;
// home page
router.get('/', auth.userRequired, main.showMain);

//登录页
router.get('/login', sign.showLogin);

router.post('/login',sign.login) ;

router.get('/chat',chat.enterChat) ;

//注册
router.post('/signup', sign.signup);




module.exports = router;
