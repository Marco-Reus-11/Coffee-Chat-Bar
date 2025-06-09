const express = require("express")
const router = express.Router()
const Users = require("../models/Users")
const jwt = require("jsonwebtoken")
const auth = require("../middlewares/auth")

const SECRET_KEY = 'MORTALKOMBAT'

//注册
router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const oldUser = await Users.findOne({ uName: username });
        if (oldUser) {
            res.status(409).json({ message: "用户名已存在,注册失败" }); // 409是资源冲突
        } else {
            const uid = Date.now();
            const newUser = new Users({
                uID: uid,
                uAvatar: "/images/ava.jpg",
                uName: username,
                Password: password,
                Friends: []
            });
            await newUser.save();
            res.status(200).json({ message: `新用户 ${username} 注册成功!` });
        }
    } catch (err) {
        console.error("注册失败", err);
        res.status(500).json({ message: "服务器内部错误" });
    }
});


// 登录
router.post("/login",async(req,res)=>{
    const {username,password} = req.body
    try{
       const user = await Users.findOne({uName:username,Password:password})
       if(user){
        const uid = user.uID
        const uava = user.uAvatar
        const token = jwt.sign({ username,uid,uava }, SECRET_KEY, { expiresIn: '7d' })
        res.json({token})
       }
       else{
        res.status(401).json({message:"用户名或密码错误"})
       }
    }
    catch(err){
        res.status(500).json({message:"服务器内部错误"})
    }
})

//获取当前用户基本信息
router.get("/info",auth,async(req,res)=>{
  try{
    const myId = req.user.uid
    const username = req.user.username
    const avatar = req.user.uava
    //到时候加个背景色持久化
    res.json({id:myId,name:username,ava:avatar})
  }catch(err){
    console.error("或许个人信息失败",err)
  }
})

//获取当前好友的头像
router.get("/friend_avatar/:id",async(req,res)=>{
  try{const id = req.params.id
  const friend = await Users.findOne({uID:id})
  res.json({ava:friend.uAvatar})}
    catch(err){
      console.error("获取头像失败：",err)
    }
})

//获取好友列表
router.get("/friends", auth, async (req, res) => {
  try {
    const myId = req.user.uid
    const user = await Users.findOne({ uID: myId })

    const friends = user.Friends || []

    const friend_list = await Promise.all(
      friends.map(async (friend) => {
        const fri = await Users.findOne({ uID: friend.uID })
        return {
          id: fri.uID,
          name: fri.uName,
          avatar: fri.uAvatar
        }
      })
    )

    res.json(friend_list)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


module.exports = router