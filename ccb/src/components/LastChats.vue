<template>
    <div class="contacts">
        <div class="set" v-if="issetting">
            <div class="set_" @click="toBeige">Beige</div>
            <div class="set_" @click="toMist">Mist</div>
            <div class="set_" @click="toApricot">Apricot</div>
        </div>
        <div class="top">
            <div class="top_child">
                <input type="button" value="◁" @click="back" id="button">
                <span>Chat</span>
                <div class="chatroom"><button @click="$router.push('/chatbox/chathall')">+</button></div>
            </div>
        </div>
        <div class="middle">
            <div class="setting" @click="setcolor"><font-awesome-icon :icon="['fas', 'gear']" title="更换背景色"/></div>
            <div class="avatar">
                <div class="frame">
                    <img :src="userava" alt="">
                </div>
            </div>
            <div class="friendname">{{username?username:"游客"}}</div>
            <div class="status" :class="statu==='occupied'?'busy':''">
                <div class="sta">
                    <select name="status" id="statusbox" v-model="statu">
                        <option value="available" class="aval">available</option>
                        <option value="occupied" class="occu">occupied</option>
                    </select>
                </div>
            </div>
            <div class="search">
                <input type="text" name="" id="" placeholder="Search">
            </div>
        </div>
        <div class="bottom">
            <div class="head">Last chats</div>
            <ul class="chat-list">
                <li class="chat-item" v-for="friend in friends" @click="switchChat(friend)" >
                    <div class="avatar-box">
                        <div class="avatar-small">
                        <div :class="{ 'tips': friend.isNewmsg }"></div>
                        <img :src="friend.avatar" alt="图片">
                    </div>
                    </div>
                    <div class="detail">
                        <div class="name">{{friend.name}}</div>
                        <div class="info">{{friend.lastMessage}}</div>
                    </div>
                    <div class="time">{{formatDate(friend.lastTime)}}</div>
                </li>
            </ul>
        </div>
        <!-- <div class="privacy"><div class="avatar"><img src="../images/avatar.jpg" alt=""></div></div> -->
    </div>
</template>

<script setup>
import axios from 'axios'
import {onBeforeUnmount, ref} from 'vue'
import { defineEmits } from 'vue'
import { onMounted } from 'vue'    
import { useChatStore } from '../stores/useChatStore'
import {socket} from "../../utils/socket"
import { watch } from 'vue'

const statu = ref("available")
const issetting = ref(false)
const friends = ref([])
const From = ref("")

const userid = ref("")
const username = ref("")
const userava = ref("")

const chatStore = useChatStore()

const emit = defineEmits(["hidechat",'changecolor',"todetail"])

function back() {
    emit("hidechat","关掉聊天")
}

function setcolor(){
    issetting.value = true
}

function toBeige(){
    emit("changecolor",{color:"beige"})
    issetting.value = false
}
function toMist(){
    emit("changecolor",{color:"mist"})
    issetting.value = false
}
function toApricot(){
    emit("changecolor",{color:"apricot"})
    issetting.value = false
}

// UI切换聊天页
function switchChat(friend){
    chatStore.switchChatUser(friend.id)
    emit("todetail",{uname:friend.name,img:friend.img})
    
    // 直接将当前点击的 friend 标记为已读
    if(friend){ 
        friend.isNewmsg = false; 
    }
}

// 时间格式化
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const current_date = new Date()
    if(date.toLocaleDateString() === current_date.toLocaleDateString()){
        return isNaN(date.getTime()) ? "" : date.toLocaleTimeString().slice(0,5);
    } else {
        return isNaN(date.getTime()) ? "" : date.toLocaleDateString().slice(0,10);
    }
}

// 初始化个人信息并连接 Socket
onMounted(async()=>{
    try{
        const token = localStorage.getItem("token")
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/info`, {
        headers: {
            authorization: `Bearer ${token}`
        }
        })
        username.value = res.data.name
        userid.value = res.data.id
        userava.value = res.data.ava
        socket.emit("login",res.data.id)
    }
    catch(err){
        console.error("用户名获取失败：",err)
    }
})

// 初始化 friends 数组（获取好友基本信息和最近聊天内容）
onMounted(async () => {
    try {
        const token = localStorage.getItem('token')
        const res = await axios(`${import.meta.env.VITE_BASE_URL}/user/friends`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        const newFriends = res.data

        const lastMsgPromises = newFriends.map(friend =>
            axios.get(`${import.meta.env.VITE_BASE_URL}/chat/last_message/${friend.id}`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            }).then(msgRes => ({
                id: friend.id,
                lastMessage: msgRes.data.content,
                lastTime: msgRes.data.time
            })).catch(err => {
                console.error(`初始化时获取${friend.name}的消息失败`, err)
                return { id: friend.id, lastMessage: '', lastTime: '' }
            })
        )

        const lastMessages = await Promise.all(lastMsgPromises)

        newFriends.forEach(friend => {
            const msg = lastMessages.find(m => m.id === friend.id)
            Object.assign(friend, {
                lastMessage: msg?.lastMessage || '',
                lastTime: msg?.lastTime || '',
                isNewmsg: false
            })
        })

        friends.value = [...newFriends].filter(friend => friend.lastMessage !== '') // 确保这里是响应式更新
    } catch (err) {
        console.error("初始化联系人或消息失败:", err)
    }
})

async function updateFriendMessage(fromUserId) {
    const senderIndex = friends.value.findIndex(friend => friend.id === fromUserId);
    if (senderIndex !== -1) {
        try {
            const token = localStorage.getItem('token');
            const msgRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/chat/last_message/${fromUserId}`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });

            friends.value[senderIndex].isNewmsg = true;
            friends.value[senderIndex].lastMessage = msgRes.data.content || '';
            friends.value[senderIndex].lastTime = msgRes.data.time || '';
        } catch (err) {
            console.error(`收到新消息通知后，获取用户 ${fromUserId} 最新消息失败:`, err);
            friends.value[senderIndex].isNewmsg = true; 
        }
    } else {
        console.warn(`未找到 ID 为 ${fromUserId} 的朋友在 friends 列表中。`);
    }
}

onMounted(() => {
    socket.on('private-message', ({ from }) => { 
        From.value = from; 
        updateFriendMessage(from);
    });
});

onBeforeUnmount(()=>{
    socket.off("private-message")
})
</script>

<style scoped>
:root {
    --primary-color: #4CAF50;
    --border-color: rgba(0, 0, 0, 0.1);
    --shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.contacts {
    height: 100%;
    /* min-width: 100%; */
    max-width: 100vw;
    display: flex;
    flex-direction: column;
    background-color: transparent;
    overflow: hidden;
}

.set{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    display: flex;
    /* flex-direction: column; */
    height: 100%;
    width: 100%;
    z-index: 999;
    cursor: pointer;
}

.set_{
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    white-space: wrap;
    flex-wrap: wrap;
    transition: all 1.5s ease;
}

.set_:hover{
    font-size: 3rem;
}

.set_:first-child{
    color: #444444;
    background-color: #f9f9f9;
    border: none;
}
.set_:nth-child(2){
    background-color: rgba(220, 225, 230, 1);
    color: #2c3e50;
    border: none;
}

.set_:last-child{
    color: #5c4033	;
    background-color: rgba(255, 235, 215, 1);
    border:none;
}

/* 顶部区域 */
.top {
    height: 60px;
    padding: 0 1rem;
    border-bottom: 1px solid var(--border-color);
    flex-shrink: 0;
    box-shadow: 0 1px 1px 0px rgba(0,0,0,.1);

}

#button,.status,.search,.setting,.avatar,.chat-list,.chatroom button{
    -webkit-app-region: no-drag
}

.top_child {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
}

.top_child input {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
}

.top_child input:hover {
    transform: scale(1.05);
}

.chatroom{
    position: absolute;
    right: 0;
}

.chatroom button{
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: larger;
}
.chatroom button:hover{
    transform: scale(1.05);
}

.chatroom button::after {
  content: "加入聊天室";
  position: absolute;
  top: 50%;
  left: -200%;
  transform: translateY(-50%);
  white-space: nowrap;
  background: rgba(0,0,0,0.75);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.chatroom button:hover::after {
  opacity: 1;
}


/* 中间区域 */
.middle {
    height: 15rem;
    padding: 2rem 1rem;
    position: relative;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    align-items: center;
    gap: 1rem;
    border-bottom: 1px solid var(--border-color);
}

.setting {
    position: absolute;
    top: 1rem;
    right: 1rem;
    cursor: pointer;
}

.avatar {
    width: 100%;
    max-width: 120px;
    /* margin-bottom: 1rem; */
    display: flex;
    justify-content: center;
}

.frame {
    width: 80%;
    /* width: 100%; */
    border-radius: 50%;
    overflow: hidden;
    aspect-ratio: 1/1;
    box-shadow: var(--shadow);
}

.frame img {
    max-width: 100%;
    aspect-ratio: 1/1;
    object-fit: cover;
}

.friendname {
    font-size: 1.2rem;
    font-weight: 600;
    /* margin-bottom: 0.5rem; */
}

.status {
    width: 150px;
    padding: 0.5rem;
    border-radius: 20px;
    background-color: rgba(127,255,212,.3);    
}

.status select {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    color: green;
    padding: 0.25rem;
    cursor: pointer;
    font-weight: bolder;
}

.status.busy{
    background-color: #f5f2f7;
}

.status.busy select{
    color: red;
}

.aval{
    color: green;
    background-color: #ccffeb;
}
.occu{
    color: red;
    background-color: #f8f1e4;
}

.search {
    width: 100%;
    max-width: 300px;
    margin-top: 1rem;
}

.search input {
    width: 80%;
    padding: 0.75rem 2.5rem 0.75rem 1rem;
    border: none;
    border-radius: 20px;
    background-color: rgba(0, 0, 0, 0.05);
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

/* 底部聊天列表 */
.bottom {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.head {
    margin-top: 20px;
    /*max-height: 10px; */
    padding:0.5rem 1rem;
    font-weight: 600;
    color: #666;
    flex-shrink: 0;
    box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.1)
}

.chat-list {
    flex: 1;
    overflow-y: auto;
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    /* background-color: #4CAF50; */
}

.chat-item {
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: background-color 0.3s ease;
    cursor: pointer;
    position: relative;
    /* flex: 0 0 25%; */
}

.chat-item:hover {
    background-color: rgba(0, 0, 0, 0.02);
}

.avatar-box {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    flex-shrink: 0;
    position: relative;
}
.avatar-small {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
}

.avatar-small img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.tips{
    position: absolute;
    color: white;
    top: 0;
    right: 0;
    background-color: red;
    border-radius: 50%;
    height: 25%;
    aspect-ratio: 1/1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: small;
    transform: translate(50%,-50%);
}

.detail {
    flex: 1;
    min-width: 0;
}

.name {
    font-weight: 500;
    margin-bottom: 0.25rem;
}

.info {
    color: #666;
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow:ellipsis;
}

.time {
    color: #999;
    font-size: 0.8rem;
    white-space: nowrap;
}

@media (max-width: 768px) {
    #button{
        display: none;
    }
    .top_child span{
        font-weight: bolder;
    }
    .set{
        display: flex;
        flex-direction: column;
    }
}

/* @media (max-width: 490px) {
    .contacts {
        width: 100%;
    }
    
    .middle {
        padding: 1rem;
    }
    
    .search {
        max-width: 100%;
    }
}

@media (min-width: 769px) {
    .contacts {
        border-right: 1px solid var(--border-color);
    }
} */
</style>