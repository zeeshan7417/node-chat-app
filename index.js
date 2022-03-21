var express = require("express");
const app = express();
var http = require("http").Server(app);
const path = require("path");
var io = require("socket.io")(http);
require("dotenv").config();
app.use(express.static(path.join(__dirname, "public")));
const commontext = require("./utils/common");
const {  userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers} = require('./utils/userjoin');
let botName = "Welcome To Chat Bot";


// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    console.log(socket);

    socket.join(user.room);

    // Welcome current user

    socket.emit('message', commontext(botName, 'Welcome to ChatCord!'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        commontext(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
      console.log('server',  msg);
    const userss = getCurrentUser(socket.id);
    io.emit('message', commontext(userss.username, msg));

   // io.to(userss.room).emit('message', commontext(userss.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const usersss = userLeave(socket.id);

    if (usersss) {
      io.to(usersss.room).emit(
        'message',
        commontext(botName, `${usersss.username} has left the chat`)
      );

      // Send users and room info
      io.to(usersss.room).emit('roomUsers', {
        room: usersss.room,
        users: getRoomUsers(usersss.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => console.log(`Server running on port ${PORT}`));