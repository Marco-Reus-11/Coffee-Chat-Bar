const express = require("express")
const router = express.Router()
const Room = require("../models/Room")


//这个是查询有没有满人，看看有无进入条件，具体退出逻辑放server.js里
router.get("/check-room/:roomId",async(req,res)=>{
    const roomId = req.params.roomId
    const room = await Room.findById(roomId)

    if(!room)return res.status(404).json({success:false,message:"房间不存在"})
    if (room.Members.length>=8){
        return res.json({success:false,message:"当前房间已满员"})
    }

    return res.json({success:true,message:"当前房间可进入"})
    })

module.exports = router