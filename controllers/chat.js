//var cache = require('/commons/cache');
var client = require('../commons/redis') ;

exports.enterChat = function (req, res , next) {
    let room = req.query['roomid'] ;
    //req.session.room = room ;
    let username = req.session.user ;
    let sessionid = req.session.id ;

    client.set(sessionid ,"{username:'" + username + "',room:'" + room + "'}") ;
   // cache.setRoom(username , room) ;
    res.render('chat',{ roomId: room.id , sessionId:req.session.id});
};