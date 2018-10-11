var socketio = require('socket.io');
//var cache = require('/commons/cache')
var client = require('../commons/redis') ;
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};



exports.listen = function(server) {
  io = socketio.listen(server);
  io.set('log level', 1);
  io.sockets.on('connection', function (socket) {
      console.log('socketid:' + socket.id) ;
      let roomid ;

      //服务端在redis以session形式存储用户信息
      //服务端在用户进入房间时也在redis上记录这个信息
      //客户端通过发送sessionid以证明自己的身份
      socket.on("session",function (sessionid) {
          client.get(sessionid ,function (err,result) {
              if(err) throw err ;
              console.log (result);
              let sessionInfo = eval("("+result + ")");
              //console.log( 'Got: ' + sessionInfo['username']) ;
              joinRoom(socket, sessionInfo['room'] , sessionInfo['username']);
          })
          //roomid = room ;
          //joinRoom(socket, roomid);
      })
      //guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);


      handleMessageBroadcasting(socket, nickNames);
      /* handleNameChangeAttempts(socket, nickNames, namesUsed);
       handleRoomJoining(socket);
       socket.on('rooms', function() {
         socket.emit('rooms', io.sockets.manager.rooms);
       });
       handleClientDisconnection(socket, nickNames, namesUsed);*/
  });
};

function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
  var name = 'Guest' + guestNumber;
  nickNames[socket.id] = name;
  socket.emit('nameResult', {
    success: true,
    name: name
  });
  namesUsed.push(name);
  return guestNumber + 1;
}

function joinRoom(socket, room , user) {
  socket.join(room);  //加入组

  currentRoom[socket.id] = room;
  console.log("server room join " + room) ;
  socket.emit('joinResult', {room: room}); //通知连接上的客户端已加入
  socket.broadcast.to(room).emit('message', {  //告诉同一组中的客户端又加入了一个人
    text: user + '进来了 '
  });
  nickNames[socket.id] = user ;


    /*if (usersInRoom.length > 1) {
      var usersInRoomSummary = 'Users currently in ' + room + ': ';
      for (var index in usersInRoom) {
        var userSocketId = usersInRoom[index].id;
        if (userSocketId != socket.id) {
          if (index > 0) {
            usersInRoomSummary += ', ';
          }
          usersInRoomSummary += nickNames[userSocketId];
        }
      }
      usersInRoomSummary += '.';
      socket.emit('message', {text: usersInRoomSummary});
    }*/
    //var usersInRoom = io.sockets.clients(room);
    //socket.emit('message', {text: 'oooooo'});
}

function handleNameChangeAttempts(socket, nickNames, namesUsed) {
  socket.on('nameAttempt', function(name) {
    if (name.indexOf('Guest') == 0) {
      socket.emit('nameResult', {
        success: false,
        message: 'Names cannot begin with "Guest".'
      });
    } else {
      if (namesUsed.indexOf(name) == -1) {
        var previousName = nickNames[socket.id];
        var previousNameIndex = namesUsed.indexOf(previousName);
        namesUsed.push(name);
        nickNames[socket.id] = name;
        delete namesUsed[previousNameIndex];
        socket.emit('nameResult', {
          success: true,
          name: name
        });
        socket.broadcast.to(currentRoom[socket.id]).emit('message', {
          text: previousName + ' is now known as ' + name + '.'
        });
      } else {
        socket.emit('nameResult', {
          success: false,
          message: 'That name is already in use.'
        });
      }
    }
  });
}

function handleMessageBroadcasting(socket) {
  socket.on('message', function (message) {
    socket.broadcast.to(message.room).emit('message', {
      text: nickNames[socket.id] + ': ' + message.text
    });
  });
}

function handleRoomJoining(socket) {
  socket.on('join', function(room) {
    socket.leave(currentRoom[socket.id]);
    joinRoom(socket, room.newRoom);
  });
}

function handleClientDisconnection(socket) {
  socket.on('disconnect', function() {
    var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
    delete namesUsed[nameIndex];
    delete nickNames[socket.id];
  });
}
