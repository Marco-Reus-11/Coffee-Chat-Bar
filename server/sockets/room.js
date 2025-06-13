const Room = require("../models/Room")

module.exports = function(socket, io) {
  const avatars = ["🐔", "🐱", "🐮", "🐶", "🐹", "🐵", "🦊", "🐸"];
  const seats = Array.from({ length: 8 }, () => ({
    username: null,
    useravatar: "🪑",
    userID: null,
  }));

  // 用户加入逻辑
  function userEnter(username) {
    const index = seats.findIndex(seat => seat.username === null);
    if (index !== -1) {
      seats[index].username = username;
      seats[index].useravatar = avatars[index];
      seats[index].userID = socket.id;

      console.log(`用户 [${username}] 加入房间，占用座位 [${index}]`);

      io.emit("update", seats);
    } else {
      console.log("房间已满");
      socket.emit("Full");
    }
  }

  // 用户退出逻辑
  function userExit() {
    const index = seats.findIndex(seat => seat.userID === socket.id);
    if (index !== -1) {
      const username = seats[index].username;
      seats[index] = { username: null, useravatar: "🪑", userID: null };
      console.log(`🚪 用户 [${username}] 离开房间，释放座位 [${index}]`);

      io.emit("update", seats);
    }
  }

  // 监听加入房间
  socket.on("joinroom", ({ room, username }) => {
    socket.data.room = room;
    socket.data.username = username;

    console.log(`用户 [${username}] 请求加入房间 [${room}]`);

    userEnter(username);
    socket.join(room);

    io.to(room).emit("notice", `用户 ${username} 进入房间`);
  });

  // 监听群聊消息
  socket.on("group-message", (msg, uname) => {
    console.log(`${uname}发来：${msg}`)
    io.to(socket.data.room).emit("group-message", { msg, uname });
  });

  // 监听断开连接
  socket.on("disconnect",async() => {
    console.log("用户断开 ->", socket.id);
    userExit();
    io.to(socket.data.room).emit("notice", `用户 ${socket.data.username} 离开房间`);
    const roomID = socket.data.room
    const room = io.sockets.adapter.rooms.get(roomID);
    const roomSize = room ? room.size : 0;

    console.log(`房间 [${roomID}] 当前人数: ${roomSize}`);

    if (roomSize === 0) {
        console.log(`房间 [${roomID}] 无人在线，准备删除数据库房间数据`);

        try {
            await Room.deleteOne({ roomID: roomID });  
            console.log(`房间 [${roomID}] 已成功从数据库删除`);
        } catch (err) {
            console.error("删除房间失败：", err);
        }
    }
  });
};