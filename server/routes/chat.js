const express = require('express')
const router = express.Router()
const Msg = require("../models/Messages")
const auth = require('../middlewares/auth')


router.get("/last_message/:id",auth,async(req,res)=>{
    const myId = req.user.uid
    const targetId = req.params.id
    try{
    const messages = await Msg.find({
    $or: [
        { from: myId, to: targetId },
        { from: targetId, to: myId }
    ]
    }).sort({ time: -1 })
    res.json(messages[0])
    }catch(err){
    res.status(401).json({messages:"最新消息获取失败"})
    }
})

router.get("/messages/:id",auth,async(req,res)=>{
    const myId = req.user.uid
    const targetId = req.params.id
    try{
    const messages = await Msg.find({
    $or: [
        { from: myId, to: targetId },
        { from: targetId, to: myId }
    ]
    }).sort({ time: 1 })
    res.json(messages)
    }catch(err){
    res.status(401).json({messages:"消息获取失败"})
    }
})

router.post("/messages/:id",auth,async (req, res) => {
    const myId = req.user.uid
    const targetId = req.params.id
    const content = req.body.content
    try {
        const new_mes = new Msg({
            from: myId,
            to: targetId,
            time: Date.now(),
            content: content
        })
        await new_mes.save()
        res.send("信息发送成功!")
    } catch (err) {
        res.status(500).json({ message: `信息发送失败：${err}` })
    }
})


module.exports = router