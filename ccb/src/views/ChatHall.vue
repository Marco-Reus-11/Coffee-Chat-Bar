<template>
    <div class="container">

      <div class="return" @click="back">←</div>

      <!-- 适时出现的创建房间菜单 -->
      <div class="overlay" v-if="buildnew">
        <div class="menu">
        <div class="close" @click="close">×</div>
        <div class="build-name"><input type="text" name="room-name" id="room-name" v-model="roomName" autocomplete="off" placeholder="房间名" maxlength="6"></div>
        <div class="build-id"><input type="text" name="room-name" id="room-name" v-model="roomID" autocomplete="off" placeholder="房间号" maxlength="6" @input="roomID = roomID.replace(/\D/g, '')"></div>
        <button @click="buildNewRoom">创建房间~</button>
      </div>
      </div>

      <!-- 这个是让用户确认进入聊天室 -->
      <div class="overlay"  v-if="isEnter">
          <div class="menu">
          <div class="close" @click="close">×</div>
          <div class="notice">即将进入房间：<strong style="color: red;font-weight: 1000;">{{tem_name}}</strong></div>
        <button @click="makesure">开启畅聊~</button>
      </div>
      </div>

        <div class="top">匿名聊天室</div>
        <div class="middle">
            <div class="room-list">
              <!-- <div v-for="item in roomlists"></div> -->
                  <div class="room-item" v-for="room in roomlists" @click="enterRoom(room)">
                    <div class="room-name">{{room.RoomName}}</div>
                    <div class="room-id"><strong>{{room.RoomID}}</strong></div>
                    <!-- <div class="room-num">在线人数:{{room.num<1000?room.num:"999+"}}</div> -->
                    <div class="room-num">在线人数:999+</div>
                </div>
            </div>
        </div>
        <div class="bottom"><button @click="buildNew">创建聊天室</button></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { nextTick } from 'vue'
// import {socket,waitForSocketConnection} from "../../utils/socket"

const router = useRouter()

const roomName = ref("")
const roomID = ref("")
const buildnew = ref(false)
const roomlists = ref([])
const uname = ref("")

const isEnter = ref(false)
const tem_name = ref("")
const tem_id = ref("")
const tem_num = ref("")

function buildNew(){
  if(!buildnew.value){
    buildnew.value = true
  }
}

//创建新房间并让房主自动进房
async function buildNewRoom() {
  if (roomName.value && roomID.value) {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/room/create/${roomID.value}`,
        { roomname: roomName.value },
        { headers: { authorization: `Bearer ${token}` } }
      );

      buildnew.value = false;
      router.push({ path: "chatroom", query: { id: roomID.value, name: roomName.value ,uname:uname.value} });
      
      roomName.value = "";
      roomID.value = "";
    } catch (err) {
      console.error("创建房间失败:", err);
      alert("房间号重复，创建失败，请重试!");
      roomName.value = "";
      roomID.value = "";
    }
  }
}

//唤醒确认进入
function enterRoom(room){
  tem_name.value = room.RoomName
  tem_id.value = room.RoomID

  isEnter.value = true
}

//其它成员进入房间
async function makesure(){
  router.push({path:"chatroom",query:{id:tem_id.value,name:tem_name.value,uname:uname.value}})
  isEnter.value = false
}

function close(){
  if(buildnew.value){
    buildnew.value = false
  }
  
  if(isEnter.value){
    isEnter.value = false
  }
}

onMounted(async()=>{
  try{
    const token = localStorage.getItem("token")
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/room/getrooms`, {
    headers: {
      authorization: `Bearer ${token}`
    }
    })
    roomlists.value = res.data.roomlists
    uname.value = res.data.uname
  }
  catch(err){
    console.error("房间列表获取失败:",err)
  }
})

function back() {
  router.back();
}

</script>

<style scoped>
    .container{
        height: 100vh;
        width: 100vw;
        background-color: #1e1f24;
        display: flex;
        flex-direction: column;
        color: white;
        overflow: hidden;
        position: relative;
    }

    .return{
        position: absolute;
        top: 5px;
        left: 5px;
        /* right: 0; */
        width: 35px;
        background-color: rgba(255,255,255,.3);
        border-radius: 50%;
        aspect-ratio: 1/1;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: all 0.5s ease-in;
        font-weight: bolder;
    }
    .return:hover{
        transform: scale(1.05);
    }

    /* 开房菜单的样式 */
    .overlay{
      position: fixed;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-color: #1e1f24;
    }

    .menu{
      position: fixed;
      left: 50%;
      top: 50%;
      border: 1px solid white;
      width: 300px;
      height: 200px;
      transform: translate(-50%,-50%);
      background-color: rgba(255,255,255,.5);
      border-radius: 20px;
      padding: 20px;
      padding-top: 50px;
      display: flex;
      flex-direction: column;
      gap: 50px;
      z-index: 999;
    }

    .close{
      position: absolute;
      top: 10px;
      right: 10px;
      width: 30px;
      aspect-ratio: 1/1;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      box-shadow: 0 0px 3px 1px rgba(0,0,0,.5);
      color: black;
      cursor: pointer;
      transition: all 0.5s ease;
    }
    .close:hover{
      transform: translateY(-5px);
    }

    .build-name,.build-id{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      font-size: 1.5rem;
    }

    .menu input{
      /* border: 1px solid black; */
      border: none;
      outline: none;
      background-color: transparent;
      /* box-shadow: 0 0px 30px 0px rgba(255,255,255,.5); */
      border: 1px solid rgba(255,255,255,.5);
      font-size: 1.5rem;
      line-height: 2rem;
      width: 100%;
      right: 0;
      color: #2f4f4f;
      border-radius: 10px;
      padding: 0 1rem;
    }
    

    .menu button{
      position: absolute;
      bottom: 10%;
      left: 50%;
      transform: translateX(-50%);
      height: 50px;
      width: 200px;
      border-radius: 20px;
      border: none;
      cursor: pointer;
    }

    .notice{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      font-size: larger;
      width: fit-content;
      white-space: nowrap;
    }

    .top{
        /* border: 1px solid black; */
        flex: 1;
        font-size: 22px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }
    .middle{
        /* border: 1px solid black; */
        flex: 9;
        max-height: 75vh;
        overflow: hidden;
        padding: 20px 15px;
    }
    .room-list{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        flex-wrap: wrap;
        gap: 10px;
        row-gap: 20px;
    }
    .room-item{
        flex: 0 0 calc(50% - 5px);
        box-sizing: border-box;
        /* border: 1px solid white; */
        height: 16vh;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: space-between;
        padding: 10px 5px;
        padding-left: 15px;
        background-color: rgba(255,255,255,.04);
        box-shadow: 0 0 1px 1px rgba(0,0,0,.1);
        overflow: hidden;
        cursor: pointer;
    }
    .room-name{
        font-weight: bold;
        background: linear-gradient(to right, #ff7e5f, #feb47b);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    .room-num{
        width: 100%;
        display: flex;
        justify-content: space-between;
        font-size: small;
    }

    .room-num button{
        color: lightgreen;
        background:transparent;
        border-radius: 5px;
        width: 35px;
        text-align: center;
        box-shadow: 0 0 1px 1px rgba(255,255,255,.2);
    }

    .bottom{
        flex: 2;
        display: flex;
        justify-content: center;
    }
    .bottom button{
        height: 50px;
        width: 250px;
        border-radius: 20px;
        /* margin-top: 20px; */
        background-color: rgb(134, 225, 237);
        border: none;
        color: white;
        font-size: large;
        cursor: pointer;
        transition: all 0.5s ease-in;
    }

    /* .bottom button:hover{
      transform: scale(1.05);
    } */
</style>
