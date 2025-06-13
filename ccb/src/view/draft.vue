<template>
    <div class="box">
            <div class="main">
                <div class="top">
                    <h4>{{uname}}</h4>
                    <button @click="muted">{{disturb?"🔊":"🔇"}}</button>
                    <button class="off" @click="offmessage">✖</button>
                </div>
                <div class="middle" ref="messageList">
                    <ul>
                        <li class="message" v-for="message in messages">
                                    <div class="avatar" v-if="message.from===chatstore.currentChatUser"><img :src="avatar" alt="图片"></div>
                                <div class="text" :class="{me:message.from!==chatstore.currentChatUser}">
                                    <div class="content">{{message.content}}</div>
                                </div>
                        </li>
                    </ul>
                </div>
                <div class="bottom">
                    <div v-if="showPicker" class="emoji-picker-container">
                        <emoji-picker id="emoji-picker-instance" class="absolute bottom-full right-0 mb-2"></emoji-picker>
                    </div>
                    <div class="send">
                        <button @click="showpicker">😋</button>
                        <button>📁</button>
                        <button  @click="send" :class="{active:new_message.trim().length>0}">send</button>
                    </div>
                    <textarea name="content" id="content" v-model="new_message" @keyup.enter="send"></textarea>
                </div>
            </div>
    </div>
</template>

<script setup>
import {ref,nextTick,onMounted} from 'vue'
import { useRoute } from 'vue-router'
import { useChatStore } from '../stores/useChatStore'
import axios from 'axios'
import { watch } from 'vue'
import {socket} from "../../utils/socket"
import { onBeforeUnmount } from 'vue'

const messages = ref([])
const messageList = ref(null)
const new_message = ref("")
const disturb = ref(true)
const chatstore = useChatStore()

const uname = ref("")
const avatar = ref("")
const route = useRoute()
const showPicker = ref(false)


onMounted(()=>{
    uname.value = route.query.uname
    avatar.value = route.query.img

    //这里获取对方头像
    getavatar()

    //这里写获取消息列表
    getlists()

    const el = messageList.value
    if(el){
            el.scrollTop = el.scrollHeight
        }
})

//拿对方头像
async function getavatar(){
    const res =await axios.get(`${import.meta.env.VITE_BASE_URL}/user/friend_avatar/${chatstore.currentChatUser}`)
    avatar.value = res.data.ava
}

//拿对话消息
async function getlists(){
    try{
        const token = localStorage.getItem("token")
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/chat/messages/${chatstore.currentChatUser}`,
            {headers: 
                {Authorization: `Bearer ${token}`}
            }
        )
        messages.value = res.data
    }
    catch(err){
        console.error("消息获取失败:",err)
    }
}

//发送信息之后同步pinia和数据库
async function send(e) {
    e.preventDefault()
    if (new_message.value.trim()) {
        try {
            const token = localStorage.getItem("token")
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/chat/messages/${chatstore.currentChatUser}`,
                { content: new_message.value },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            new_message.value = ''

            await getlists()

            socket.emit("private-message",{to:chatstore.currentChatUser})

            nextTick(() => {
                const el = messageList.value
                if (el) {
                    el.scrollTop = el.scrollHeight
                }
            })

        } catch (err) {
            console.error("发送失败：", err)
        }
    } else {
        alert("输入内容不能为空！")
    }
}

//监听聊天对象变化从而改变UI界面
watch(() => chatstore.currentChatUser, async (newUser, oldUser) => {
  if (newUser !== oldUser) {
    uname.value = route.query.uname
    avatar.value = route.query.img
    await getavatar()
    await getlists()
    nextTick(() => {
      const el = messageList.value
      if (el) el.scrollTop = el.scrollHeight
    })
  }
})

watch(()=>route.query.uname,(new_uname)=>{
    uname.value = new_uname
})

//消息更新滚动条跟着变
watch(messages, () => {
    nextTick(() => {
        const el = messageList.value
        if (el) {
            el.scrollTop = el.scrollHeight
        }
    })
})

function muted(){
    disturb.value = !disturb.value
}

const emit = defineEmits(['closemessage'])
function offmessage(){
    emit('closemessage')
}


// socket通信
onMounted(()=>{
    socket.on('private-message',async({from})=>{
        console.log(`收到${from}发来的信息`)
        await getlists()
    })
})

onBeforeUnmount(()=>{
    socket.off("private-message")
})


//emoji
let pickerElement = null; 
let boundAddEmoji = null; 

function showpicker(){
  showPicker.value = !showPicker.value
}

function addEmoji(event) {
  new_message.value += event.detail.emoji.unicode;
  showPicker.value = false;
}

watch(showPicker, (newValue) => {
  if (newValue) {
    nextTick(() => {
      pickerElement = document.getElementById('emoji-picker-instance');
      if (pickerElement) {
        boundAddEmoji = addEmoji;
        pickerElement.addEventListener('emoji-click', boundAddEmoji);
        console.log('Emoji picker event listener attached via watch.');
      } else {
        console.warn('Emoji picker element still not found after nextTick.');
      }
    });
  } else {
    if (pickerElement && boundAddEmoji) {
      pickerElement.removeEventListener('emoji-click', boundAddEmoji);
      console.log('Emoji picker event listener removed via watch.');
      pickerElement = null;
      boundAddEmoji = null;
    }
  }
});
</script>

<style scoped>
    .box{
        width: 96%;
        height: 92%;
        padding: 4% 2%;
        padding-top: 2%;
        /* height: 100vh; */
    }

    .main{
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 1rem;
        background-color: rgba(128,128,128,.1);
        box-shadow: 0 0 5px 2px rgba(0,0,0,.1);
        display: flex;
        flex-direction: column;
        
    }
    .top{
        /* border-top: 1px solid black; */
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;
        flex: 1;
        display: flex;
        align-items: center;
        box-shadow: 0 1px 1px 0px rgba(0,0,0,.1);
        padding-left: 1vw;
        font-size: larger;
        font-weight: bolder;
        position: relative;
    }
    .top button{
        /* border-radius: 50%; */
        height: 45px;
        width: 45px;
        border: none;
        cursor: pointer;
        font-size: larger;
        background-color: transparent;
        -webkit-app-region: no-drag
    }
    .off{
        position: absolute;
        right: 0;
        border-radius: 50%;
        background-color: transparent;
    }
    .off:hover{
        background-color: rgba(128,128,128,.1)
    }
    .middle{
        /* border: 1px solid black; */
        border-radius: 1rem;
        flex: 8;
        overflow-y: scroll;
        overflow-x: hidden;
        -webkit-app-region: no-drag
    }
    *:focus{
        border: none;
        outline: none;
    }
    ul{
        height: 100%;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
    }
    li{
        flex: 0 0 20%;
        padding-top: 1vh;
        padding-left: 1vw;
        list-style-type: none;
    }
    .message{
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        padding-bottom: 10px;
    }
    .avatar{
        flex: 1;
        /* border: 1px solid black; */
        max-width: 40px;
        aspect-ratio: 1/1;
        border-radius: 50%;
        overflow: hidden;
    }
    .avatar img{
        width: 100%;
        aspect-ratio: 1/1;
        object-fit: cover;
    }
    .text{
        height: 100%;
        position: relative;
        flex: 9;
        /* background-color: aliceblue; */
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }
    .text.me{
        align-items: flex-end;
    }
    .text.me .content{
        border-radius: 1rem 1rem 0.3rem 1rem;
        margin-right: 10px;
        background-color: rgba(165, 42, 42,.8);
        color: white;
    }
    .content {
    display: inline-block;
    background-color: #f9f9f9;
    color: #333;
    padding: 0.6rem 1rem;
    margin: 0.4rem 1vw;
    border-radius: 1rem 1rem 1rem 0.3rem;
    width: fit-content;
    max-width: 70%;
    word-wrap: break-word;
    word-break: break-word;

    font-size: 17px;
    line-height: 1.4;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .triangle{
        background-color: transparent;
        width: 0;
        height: 0;
        position: absolute;
        border-top: 20px solid transparent;
        border-bottom: 30px solid #f9f9f9;
        border-left: 20px solid transparent;
        border-right: 20px solid transparent;
        bottom: 0;
        left: 5px;
        color: transparent;
    }

    /* 底部样式 */
    .bottom{
        /* border: 1px solid black; */
        box-shadow: 0 0 2px 1px rgba(0,0,0,.1);
        border-radius: 1rem 1rem 0 1rem;
        flex: 2;
        width: 96%;
        margin: 0 2% 2% 2%;
        background-color: #f9f9f9;
        max-height: 15vh;
        position: relative;
        -webkit-app-region: no-drag
    }
    .send{
        position: absolute;
        bottom: -25px;
        /* border: 1px solid black; */
        width: 100%;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        -webkit-app-region: no-drag
        /* padding: 0 10px 15px 0; */
    }
    .send button{
        height: 30px;
        /* aspect-ratio: 1/1; */
        border-radius: 10px;
        border: none;
        box-shadow: 0 0 2px 1px rgba(0,0,0,.1);
        background-color: #f9f9f9;
        cursor: pointer;
    }

    .send button:last-of-type{
        display: none;
        aspect-ratio: 2/1;
        background-color: rgba(165, 42, 42,.8);
        color: white;
    }

    .send button.active{
        display: block;
    }

    .bottom textarea{
        height: 90%;
        width: 96%;
        padding: 10px 2% 0 2%;
        border: none;
        outline: none;
        resize: none;
        border-radius: 1rem 1rem 0 1rem;
        font-size: 1rem;
        font-weight: normal;
        /* background-color: purple; */
        /* display: flex;
        justify-content: flex-start;
        align-items: flex-start; */
    }
    .emoji-picker-container{
        position: absolute;
        bottom: 0;
        right: 0;
    }
</style>