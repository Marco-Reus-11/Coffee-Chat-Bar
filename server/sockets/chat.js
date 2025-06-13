const users = new Map()

module.exports = function(socket, io) {
  socket.on("login", (userId) => {
    socket.userId = userId
    console.log(`收到登录请求:${userId}`)
    users.set(userId, socket.id)
  })

  socket.on("private-message", ({to}) => {
    const targetId = users.get(to)
    if (targetId) {
      io.to(targetId).emit('private-message',{from:socket.userId})
    }
  })

  socket.on("private-file-message", async ({ to, fileUrl, fileName, fileType }) => {
    const targetSocketId = users.get(to);
    if (targetSocketId) {
      console.log(`用户 ${socket.userId} 发送文件: ${fileName} (${fileUrl}) 给用户 ID: ${to}`);
      io.to(targetSocketId).emit("private-file-message", {
        from: socket.userId,
        fileUrl,
        fileName,
        fileType,
      });
    } else {
      console.log(`用户 ${to} 不在线或未登录，无法发送文件消息。`);
    }
  });

  socket.on("disconnect", async () => {
    console.log("用户断开 ->", socket.id);

    //用户下线之后及时清理出去
    for (const [userId, id] of users) {
      if (id === socket.id) {
        users.delete(userId)
        break
      }
    }
  });
};