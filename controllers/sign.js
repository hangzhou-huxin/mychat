var validator      = require('validator');
//var eventproxy     = require('eventproxy');
var tools          = require('../commons/tools');
//var bcrypt = require('bcryptjs');
var User           = require('../dao/user');
var utility        = require('utility');


//sign up  注册
exports.showSignup = function (req, res ,next) {
  res.render('signup');
};


//--------------------------注册---------------------------------------
exports.signup = function (req, res, next) {
  console.log("-----------signup") ;
  var loginname = validator.trim(req.body.loginname).toLowerCase();
  var pass      = validator.trim(req.body.pass);
  var rePass    = validator.trim(req.body.re_pass);

  // 验证信息的正确性
  if ([loginname, pass, rePass].some(function (item) { return item === ''; })) {
    //ep.emit('prop_err', '信息不完整。');
      console.log('------------------信息不完整。------------') ;
      res.render('signup', {error: '信息不完整。', loginname: loginname});
  }
  if (loginname.length < 5) {
    //ep.emit('prop_err', '用户名至少需要5个字符。');
      console.log('------------------用户名至少需要5个字符。------------') ;
      return res.render('signup', {error:'用户名至少需要5个字符。', loginname: loginname});
  }
  if (!tools.validateId(loginname)) {
      //return ep.emit('prop_err', '用户名不合法。');
      console.log('------------------用户名不合法。------------') ;
      return res.render('signup',{error:'用户名不合法。', loginname: loginname});
  }

  if (pass !== rePass) {
    //return ep.emit('prop_err', '两次密码输入不一致。');
      console.log('------------------两次密码输入不一致。------------') ;
      return  res.render('signup',{error:'两次密码输入不一致。', loginname: loginname})
  }
  // END 验证信息的正确性


  User.getUserByLoginName( loginname,  function (err, users) {
    if( users == null){
        console.log('----------------------保存注册用户------------') ;
        /*tools.bhash( pass, function (passhash) {
            User.newAndSave(loginname,  passhash , function (err) {
                if (err) {
                    return next(err);
                }
            });
        });*/
        var passhash = utility.md5(pass + "config.session_secret") ;
        User.newAndSave(loginname,  passhash , function (err) {
            if (err) {
                return next(err);
            }
        });
       return  res.render('index') ;
    }else{
        console.log("用户重复" + users) ;
        return res.render('signup',{error:'用户名已被使用。', loginname: loginname}) ;
    }
    if (err) {
      return res.render('index');
    }

  });
};

/**
 * Show user login page.
 *
 * @param  {HttpRequest} req
 * @param  {HttpResponse} res
 */
exports.showLogin = function (req, res) {
  req.session._loginReferer = req.headers.referer;
  res.render('login');
};






/**
 * Handle user login.
 *
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.login = function (req, res, next) {
  console.log("login sessionid : " + req.session.id) ;
  var loginname = validator.trim(req.body.name).toLowerCase();
  var password      = validator.trim(req.body.password);

  if (!loginname || !password) {
      res.status(422);
      return res.render('login', { error: '信息不完整。' });
  }

  User.getUserByLoginName( loginname,  function (err, users) {
        if(users == null ){
            return res.render('login',{error:'用户不存在。'}) ;
        }else {
            var passhash = utility.md5(password + "config.session_secret") ;
            //console.log("passhash=" + passhash + "users.pass=" + users.pass);
            if( passhash === users.pass){
                req.session.user = loginname ;
                return res.render('index') ;
            }else{
                return res.render('login',{error:'用户名或密码错误。'}) ;
            }

        }

    });

   // req.session.user = loginname ;
  //authMiddleWare.gen_session(user, res);




};

// logout
exports.logout = function (req, res, next) {
  req.session.destroy();
  res.clearCookie("io", { path: '/' });
  return res.redirect('login');
};

