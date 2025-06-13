const express = require("express")
const router = express.Router()
const Room = require("../models/Room")
const auth = require("../middlewares/auth")

const emojipool = []

//开房间
router.post("/create/:roomID",auth,async(req,res)=>{
    const id = req.params.roomID
    const name = req.body.roomname
    const user = req.user
    try{
        const repe = await Room.findOne({RoomID:id})
        const new_room =  new Room({
        RoomID:id,
        RoomName:name,
        Members:[{
        Nickname:"房主",
        Avatar:"/images/ava.jpg",
        userID:user.uid
    }]
    })
    await new_room.save()
    res.json({message:`成功创建新房间${name}`})
    }catch(err){
        res.status(401).json({message:"创建房间失败"})
    }
})  


//获取所以活跃中房间
router.get("/getrooms",auth,async(req,res)=>{
    const uname = req.user.username
    const rooms = await Room.find()
    res.json({roomlists:rooms,uname})
})


//这个是查询有没有满人，看看有无进入条件
router.get("/check/:roomID",async(req,res)=>{
    const roomID = req.params.roomID
    const room = await Room.findById(roomID)

    if(!room)return res.status(404).json({success:false,message:"房间不存在"})
    if (room.Members.length>=9){
        //这里别忘了房主也是人啊
        return res.json({success:false,message:"当前房间已满员"})
    }

    return res.json({success:true,message:"当前房间可进入"})
    })
//通过success的状态判断是否可以继续往下走


router.post("/joinroom",auth,async(req,res)=>{
    const name = req.body.name
})

router.post("exitroom",auth,async(req,res)=>{

})

module.exports = router