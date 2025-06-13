<template>
    <div class="contacts">
        <div class="top">
            <div class="top_child">
                <input type="button" value="◁" @click="back" id="button">
                <span>Contacts</span>
                <div class="friend_request"><button @click="show_request">+</button></div>
            </div>
        </div>
        <div class="bottom">
            <div class="search" v-if="newfriend">
                <input type="text" name="" id="" placeholder="Search" v-model="friend_name" autocomplete="off">
                <input type="button" value="添加♂好友" @click="friend_request">
            </div>
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
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios'
import {ref} from 'vue'
import { defineEmits } from 'vue'
import { onMounted } from 'vue'    
import { useChatStore } from '../stores/useChatStore'

const friends = ref([])
const friend_name = ref("")

const newfriend = ref(false)

const chatStore = useChatStore()

const emit = defineEmits(["hidecontacts",'changecolor',"todetail"])
function back() {
    emit("hidecontacts","关掉聊天")
}

function show_request(){
    newfriend.value = true
}

//添加好友
async function friend_request(){
    const token = localStorage.getItem("token")
    if(!friend_name.value){
        friend_name.value = ""
        return alert("请输入合法的用户名")
    }
    else{
        const name = friend_name.value
        friend_name.value = ""
        const res = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/user/add`,
            {
                content:name
            },
            {
                headers: {
                authorization: `Bearer ${token}`}
            }
        )
        console.log(token)
        alert(res.data.message)
        location.reload()
    }
}

// UI切换聊天页
function switchChat(friend){
    chatStore.switchChatUser(friend.id)
    emit("todetail",{uname:friend.name,img:friend.img})
}


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

        friends.value = [...newFriends]// 确保这里是响应式更新

        console.log("最终带消息的friends列表：", friends.value)
    } catch (err) {
        console.error("初始化联系人或消息失败:", err)
    }
})

</script>

<style scoped>
:root {
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

/* 顶部区域 */
.top {
    height: 60px;
    padding: 0 1rem;
    border-bottom: 1px solid var(--border-color);
    flex-shrink: 0;
    box-shadow: 0 1px 1px 0px rgba(0,0,0,.1);

}

#button,.status,.search,.setting,.avatar,.chat-list,.friend_request button{
    -webkit-app-region: no-drag
}

.friend_request{
    position: absolute;
    right: 0;
    transition:all 0.5s ease-in;
}

.friend_request button{
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: larger;
}
.friend_request button:hover{
    transform: scale(1.05);
}

.friend_request button::after {
  content: "添加新好友";
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

.friend_request button:hover::after {
  opacity: 1;
}

.search {
    position: absolute;
    left: 5px;
    bottom: 15px;
    width: 100%;
    margin-top: 1rem;
    animation: appear 1.5s ease-out;
    display: flex;
    flex-direction: row;
}

.search input {
    width: 50%;
    padding: 0.75rem 2.5rem 0.75rem 1rem;
    border: none;
    border-radius: 20px;
    background-color: rgba(0, 0, 0, 0.05);
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.search input[type="button"]{
    padding: 0 10px;
    width: fit-content;
    margin-left: 5%;
    margin-right: 5%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color:rgba(165, 42, 42, 0.485);
    color: white;
    cursor: pointer;
    transition: all 0.7s ease;
}

.search input[type="button"]:hover{
    transform: translateX(5px);
        background-color:rgba(165, 42, 42, 0.85);
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


/* 底部联系人列表 */
.bottom {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding-bottom: 75px;
    position: relative;
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
    position: relative;
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

    /* delete */
    /* flex: 1;
    border: 1px solid black; */
    /* flex: 0 0 25%; */
}

.chat-item:hover {
    background-color: rgba(0, 0, 0, 0.02);
}

.avatar-small {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    /* border: 1px solid black; */
}

.avatar-small img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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

@keyframes appear{
    0%{
        transform: translateX(-450px);
    }
    100%{
        transform: translateX(0);
    }
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
</style>