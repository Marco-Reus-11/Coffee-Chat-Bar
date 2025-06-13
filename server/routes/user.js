const express = require("express")
const router = express.Router()
const Users = require("../models/Users")
const jwt = require("jsonwebtoken")
const auth = require("../middlewares/auth")
const bcrypt = require('bcrypt')

const SECRET_KEY = 'MORTALKOMBAT'
const saltRounds = 10

//注册
router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const oldUser = await Users.findOne({ uName: username });
        if (oldUser) {
            res.status(409).json({ message: "用户名已存在,注册失败" });
        } else {
            const uid = Date.now();
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const newUser = new Users({
                uID: uid,
                uAvatar: "/images/maodie.jpg",
                uName: username,
                Password: hashedPassword,
                Friends: []
            });
            await newUser.save();
            res.status(200).json({ message: `新用户 ${username} 注册成功!` });
        }
    } catch (err) {
        console.error("注册失败", err);
        res.status(500).json({ message: "服务器内部错误" });
    }
})

// 登录
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await Users.findOne({ uName: username });

        if (user) {
            const isMatch = await bcrypt.compare(password, user.Password);
            if (isMatch) {
                const uid = user.uID;
                const uava = user.uAvatar;
                const token = jwt.sign({ username, uid, uava }, SECRET_KEY, { expiresIn: '7d' });
                return res.json({ token });
            } else {
                return res.status(401).json({ message: "用户名或密码错误" });
            }
        } else {
            return res.status(401).json({ message: "用户名或密码错误" });
        }
    } catch (err) {
        console.error("登录失败", err);
        res.status(500).json({ message: "服务器内部错误" });
    }
});

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

router.post("/add", auth, async (req, res) => {
  try {
    const name = req.body.content
    const userid = req.user.uid
    const currentUser = await Users.findOne({ uID: userid })
    const friends = currentUser.Friends || []

    const new_friend = await Users.findOne({ uName: name })

    if (!new_friend) {
      return res.status(401).json({ message: "当前用户不存在" });
    }

    console.log("当前用户：", userid)
    console.log("添加用户：", new_friend.uName)

    if (new_friend.uID === userid) {
      return res.status(400).json({ message: "不能添加自己为好友" })
    }

    if (friends.some(friend => friend.uID === new_friend.uID)) {
      return res.json({ message: "对方已经是您的好友!" })
    }

    //我加对方
    await Users.findOneAndUpdate(
      { uID: userid },
      { $addToSet: { Friends: { uID: new_friend.uID } } }
    )

    //对方加我
    await Users.findOneAndUpdate(
      { uID: new_friend.uID },
      { $addToSet: { Friends: { uID: userid } } }
    )

    res.json({ message: "好友添加成功!" })

  } catch (err) {
    res.status(500).json({ message: "服务端出错" })
    console.error("添加好友失败:", err)
  }
})


module.exports = router