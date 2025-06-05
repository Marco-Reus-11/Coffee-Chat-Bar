const avatars = ["🐔", "🐱", "🐮", "🐶", "🐹", "🐵", "🦊", "🐸"]
const seats = Array.from({ length: 8 }, () => ({
  username: null,
  useravatar: "🪑",
  userID: null,
}))

function userEnter(socket, username) {
  const index = seats.findIndex(seat => seat.username === null)
  if (index !== -1) {
    seats[index].username = username
    seats[index].useravatar = avatars[index]
    seats[index].userID = socket.id
    console.log("用户进来啦!!!!!")
    const newavatar = seats[index].useravatar
    const newname = seats[index].username
    socket.emit("update", { index, newname, newavatar })
  } else {
    socket.emit("Full")
  }
}

function userExit(socket) {
  const index = seats.findIndex(seat => seat.userID === socket.id)
  if (index !== -1) {
    seats[index].username = null
    seats[index].useravatar = "🪑"
    seats[index].userID = null
    console.log("用户出去了!!!!!")
    const newavatar = seats[index].useravatar
    const newname = seats[index].username
    socket.emit("update", { index, newname, newavatar })
  } else {
    socket.emit("Full")
  }
}

module.exports = function(io) {
  io.on('connection', (socket) => {
    console.log("客户端连接成功!")
    console.log(`用户${socket.id}已连接`)

    socket.on('joinroom', ({ room, username }) => {
      socket.room = room
      socket.username = username

      console.log(seats)
      console.log(`用户${username}请求加入房间${room}`)
      userEnter(socket, username)

      socket.join(room)
      io.to(room).emit("notice", `用户${username}进入房间`)
    })

    socket.on('chat', (msg, uname) => {
      io.to(socket.room).emit('chat', { msg, uname })
    })

    socket.on('disconnect', () => {
      userExit(socket)
      socket.leave(socket.room)
      io.to(socket.room).emit("notice", `用户${socket.username}离开房间`)
    })
  })
}