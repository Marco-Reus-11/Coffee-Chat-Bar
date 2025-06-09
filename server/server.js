const express = require('express')
const http = require('http')
const { Server, Socket } = require('socket.io')
const cors = require('cors')

const connectDB = require('./config/db')
// const registerSocketHandlers = require('./sockets')
const private_mgs = require("./sockets/chat")
const roomRouter = require('./routes/room')
const userRouter = require('./routes/user')
const chatROuter = require('./routes/chat')
const auth = require("./middlewares/auth")

const app = express()
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

connectDB()

app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', roomRouter)
app.use('/user', userRouter)
app.use("/chat",chatROuter)

app.get("/user/info", auth, async (req, res) => {
  res.json({ user: req.user })
})

// 查房(绷)
// app.get('/api/check-room/:roomId', (req, res) => {
//   const { roomId } = req.params
//   res.json({ exists: true, roomId })
// })

// registerSocketHandlers(io)
io.on("connection",(socket)=>{
  private_mgs(socket,io)
})

server.listen(3000, () => {
  console.log('Socket.IO 服务器已启动：http://localhost:3000')
})
