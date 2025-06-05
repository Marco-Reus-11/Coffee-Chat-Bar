const http = require('http')
const express = require('express')
const { Server } = require('socket.io')
const { connectDB } = require('./config/db')
const registerSocketHandlers = require('./sockets')
const roomRouter = require("./routes/room")

// connectDB()

const app = express()
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: "*" } })

app.use('/api',roomRouter)

app.get("/", (req, res) => {
  res.send("欢迎来到ccb")
})

app.get("/api/check-room/:roomId",(req,res)=>{
    
})

registerSocketHandlers(io)

server.listen(3000, () => {
  console.log("Socket.IO 服务器已启动：http://localhost:3000")
})
