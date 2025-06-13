<template>
  <div class="container">
    <div class="top">
      <div class="left">
        <div class="roomname">{{ roomName }}</div>
        <div class="roomnum">房间号：<strong>{{ roomID }}</strong></div>
      </div>
      <div class="right">
        <!-- <div class="counts">{{ roomNum }} <strong>Online</strong></div> -->
        <div class="counts">999+<strong>Online</strong></div>
        <div class="return" @click="back">✖</div>
      </div>
    </div>

    <div class="middle">
      <div class="users">
        <div class="host">
          <div class="avatar">
            <img src="/images/ava.jpg" alt="图片" />
          </div>
          <div class="avatar-name">{{ uname }}</div>
        </div>

        <div class="audiences">
          <div class="audience" v-for="(seat, index) in seats" :key="index">
            <div class="seat">
              <div class="seat-logo">{{ seat.useravatar }}</div>
              <div class="seat-number">
                {{ seat.username ? seat.username : `${index + 1}号位` }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="chats">
        <div class="notice">
          <div class="notice-content">
            欢迎来到 <span>{{ roomName }}</span> 聊天室，请遵循社区基本规则，不要以身试险，祝您愉快!
          </div>
        </div>
        <div class="board">
          <div class="board-content" ref="log">
            <ul>
              <li v-for="(message, index) in messages" :key="index">
                {{ message.role ? message.role : "游客" }}：{{ message.content }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showPicker" class="emoji-picker-container relative">
      <emoji-picker id="emoji-picker-instance" class="absolute bottom-full right-0 mb-2"></emoji-picker>
    </div>

    <div class="input-area">
      <input type="text" id="chat-input" v-model="msg" @keydown.enter="sendMsg" autocomplete="off" />
      <input type="button" value="😊" id="emoji-btn" class="send-button" @click="showpicker"/>
      <!-- <input type="button" value="🦵🏻" class="send-button" /> -->
      <input type="button" value="发送" class="send-button" id="send-button" @click="sendMsg" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { socket,waitForSocketConnection } from '../../utils/socket';

const route = useRoute();
const router = useRouter();

const roomName = ref(route.query.name);
const roomID = ref(route.query.id);
// const roomNum = ref(route.query.num);
const roomNum = ref(0);
const uname = ref(route.query.uname);
const msg = ref("");
const messages = ref([]);
const log = ref(null);

const showPicker = ref(false)

// 用户列表
const seats = ref(Array.from({ length: 8 }, () => ({ username: null, useravatar: "🪑" })));

let pickerElement = null; 
let boundAddEmoji = null; 

function addEmoji(event) {
  msg.value += event.detail.emoji.unicode;
  showPicker.value = false;
}

function back() {
  router.back();
}

function sendMsg() {
  if (!msg.value.trim()) {
    console.warn("内容不能为空");
    return;
  }
  socket.emit("group-message", msg.value, uname.value);
  console.log("消息发送至：",socket.id)
  msg.value = "";
}

function showpicker(){
  showPicker.value = !showPicker.value
}

function setupSocketListeners() {
  cleanupSocketListeners();

  if (socket.connected) {
    socket.emit("joinroom", { room: roomID.value, username: uname.value });
  } else {
    socket.on("connect", () => {
      socket.emit("joinroom", { room: roomID.value, username: uname.value });
    });
  }

  socket.on("group-message", ({ msg, uname: sender }) => {
    messages.value.push({ role: sender, content: msg });
    nextTick(() => {
      if (log.value) {
        log.value.scrollTop = log.value.scrollHeight;
      }
    });
  });

  socket.on("update", (newSeats) => {
    seats.value = newSeats;
    roomNum.value = newSeats.filter(seat => seat.username !== null).length;
  });

  socket.on("notice", (content) => {
    messages.value.push({ role: "系统通知", content });
    nextTick(() => {
      if (log.value) {
        log.value.scrollTop = log.value.scrollHeight;
      }
    });
  });

  socket.on("Full", () => {
    console.warn("当前房间已满");
    router.back();
  });
}

function cleanupSocketListeners() {
  socket.off("connect");
  socket.off("group-message");
  socket.off("update");
  socket.off("notice");
  socket.off("Full");

  if (pickerElement && boundAddEmoji) {
    pickerElement.removeEventListener('emoji-click', boundAddEmoji);
    console.log('Emoji picker event listener removed during component cleanup.');
    pickerElement = null; 
    boundAddEmoji = null; 
  }
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

onMounted(() => {
  setupSocketListeners();
});

onBeforeUnmount(() => {
  cleanupSocketListeners();
});
</script>

<style scoped>
    .container{
        width: 100%;
        background: linear-gradient(rgb(101, 78, 163),rgba(216,194,215));
        height: 100vh;
    }
    .top{
        height: 10vh;
        border: none;
        display: flex;
        justify-content: space-between;
        padding: 5px 10px;
    }
    .right{
        display: flex;
        gap: 10px;
        height: 50%;
    }
    .counts{
        border: none;
        border-radius: 10px;
        padding: 0 5px;
        background-color: rgba(0,0,0,.3);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .return{
        background-color: rgba(0,0,0,.3);
        border-radius: 50%;
        aspect-ratio: 1/1;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: all 0.5s ease-in;
    }
    .return:hover{
        transform: scale(1.05);
    }
    .middle{
        height: 80vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
    .users{
        height: fit-content
    }
    .host{
        /* border: 1px solid black; */
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        margin-bottom: 30px;
    }
    .avatar{
        aspect-ratio: 1/1;
        /* border: 1px solid black; */
        border-radius: 50%;
        overflow: hidden;
    }
    .avatar img{
        object-fit: cover;
        width: 50px;
    }
    .avatar-name{
        position: absolute;
        bottom: 0;
        background-color: aqua;
        font-size: small;
        border-radius: 5px;
        transform: translateY(10px);
        color: white;
        padding: 0 5%;
    }

    .audiences{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: start;
    }
    .audience{
        flex: 0 0 25%;
        box-sizing: border-box;
        /* border: 1px solid black; */
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .seat{
        /* padding-top: 5px; */
        width: 50px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .seat-logo{
        flex: 3;
        font-size: 30px;
        width: 100%;
        aspect-ratio: 1/1;
        /* border: 1px solid black; */
        border-radius: 50%;
        background-color: rgba(0,0,0,.3);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .seat-number{
        flex: 1;
    }

    .chats{
        height: 100%;
        display: flex;
        flex-direction: column;
        min-height: 0
    }

    .notice{
        /* border: 1px solid white; */
        display: flex;
        justify-content: center;
        padding-top: 10px;
        height: fit-content;
        margin-bottom: 10px;
    }

    .notice-content{
        background-color: rgba(255,255,255,.1);
        box-shadow: 0 0 1px 0px rgba(0,0,0,.3);
        width: 70%;
        padding: 1px;
        font-size: small;
        height: fit-content;
        border-radius: 5px;
        text-align: center;
    }

    .notice-content span{
        color: rgba(255,0,0,.8);
    }

    .board{
        flex: 1;
        display: flex;
        justify-content: center;
        overflow: hidden;
        max-height: 100%;
        min-height: 0;
    }

    .board-content{
        background-color: rgba(255,255,255,.1);
        box-shadow: 0 0 1px 0px rgba(0,0,0,.3);
        width: 90%;
        padding: 1px;
        font-size: small;
        overflow: auto;
        padding: 0 1rem;
        padding-top: 0.5rem;
        border-radius: 5px;
        margin-bottom: 2px;
    }

    .board-content li{
        /* border: 1px solid black; */
        width: fit-content;
        color: white;
        box-shadow: 0 0 5px 1px rgba(0,0,0,.1);
        margin-bottom: 10px;
    }

    .bottom{
        width: 100%;
        position: fixed;
        height: 10vh;
        display: flex;
        flex-direction: row;
        /* border-top: 1px solid black; */
        align-items: center;
        gap: 5px;
        margin-bottom: 10px;
    }
    #chat-input{
        flex: 1;
        height: min(10px,80%);
        border-radius: 30px;
        padding: 1rem;
        /* padding-top: 0.5rem; */
        font-size: 1rem;
        overflow: hidden;
        white-space:nowrap;
        color: black;
        resize: none;
        /* margin-bottom: 10px; */
        margin-left: 10px;
        border: none;
        outline: none;
    }
    /* #picker {
    position: absolute;
    bottom: 75px;
    width: 100%;
    height: 40vh;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    z-index: 999;
    padding: 10px;
    overflow-y: auto;
    transition: all 0.3s ease;
    } */
    
    .emoji-picker {
        position: absolute;
        bottom: 75px;
        width: 100%;
        height: 40vh;
        z-index: 999;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
    }
    .input-area {
        position: relative;
        display: flex;
        align-items: center;
        padding: 10px;
    }
            
    .send-button{
        height: 40px;
        aspect-ratio: 1/1;
        border-radius: 50%;
        border: none;
        cursor: pointer;
    }
    .send-button:last-child{
        color: orange;
    }
    ul{
        list-style-type: none;
    }
    li{
        margin: 0.5rem 0;
    }

    .emoji-picker-container {
    position: absolute;
    bottom: 0;
    right: 0;
    right: 15px;
    z-index: 20;
    width: 100%;
    max-width: 350px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    overflow: hidden;
    transform: translateY(-75px);
    }
</style>
