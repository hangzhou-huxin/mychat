var roomMap = {} ;

exports.setRoom = function ( username , roomid) {
    roomMap[username] = roomid ;
}


exports.getRoom = function (username) {
    return roomMap[username] ;
}