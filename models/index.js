var mongoose = require('mongoose');
//var config   = require('../config');
//var logger = require('../common/logger')

mongoose.connect('mongodb://127.0.0.1/test2', {
  server: {poolSize: 20}
}, function (err) {
  if (err) {
    //logger.error('connect to %s error: ', config.db, err.message);
    process.exit(1);
  }
});

// models
require('./user');

exports.User         = mongoose.model('User');