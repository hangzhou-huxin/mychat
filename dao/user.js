var models  = require('../models');
var User    = models.User;




/**
 * 根据登录名查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} loginName 登录名
 * @param {Function} callback 回调函数
 */
exports.getUserByLoginName = function (loginName, callback) {
    User.findOne({'loginname': new RegExp('^'+loginName+'$', "i")}, callback);
};



exports.newAndSave = function ( loginname, pass,   callback) {
    var user         = new User();
    user.loginname   = loginname;
    user.pass        = pass;

    user.save(callback);
};


