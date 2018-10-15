

/**
 * 需要登录
 */
exports.userRequired = function (req, res, next) {

    console.log(req.cookies) ;
    console.log("req:" + req.session.user) ;
  if (!req.session || !req.session.user ) {
    return res.render('login') ;
  }
  next();
};

exports.genSession = function gen_session(user, res) {
    var auth_token = user._id ;
    var opts = {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30,
        signed: true,
        httpOnly: true
    };
    res.cookie("mysession", auth_token, opts); //cookie 有效期30天
}


