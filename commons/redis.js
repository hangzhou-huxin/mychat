var redis = require('redis');

var client = redis.createClient(6379,'192.168.111.130');

client.on('error', function (err) {
    if (err) {
        logger.error('connect to redis error, check your redis config', err);
        process.exit(1);
    }
})

exports = module.exports = client;