const users = new Map()

module.exports = (socket,io)=>{
    socket.on("login",(userId)=>{
        users.set(userId,socket.id)
    })

    socket.on("private-message",({to})=>{
        const targetId = users.get(to)
        if(targetId){
            io.to(targetId).emit('private-message',{from:socket.id})
        }
    })

    //用户下线之后及时清理出去
    socket.on('disconnect', () => {
    for (const [userId, id] of users) {
      if (id === socket.id) {
        users.delete(userId)
        break
      }}})

}