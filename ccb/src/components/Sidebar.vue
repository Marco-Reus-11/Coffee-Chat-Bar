<template>
    <div class="sidebar">
        <div class="logo"><img src="/images/logo.png" alt="LOGO" title="AI智能小助手" @click="toAI"></div>
        <div class="toolbar">
            <ul>
                <li><font-awesome-icon icon="comment" title="聊天" @click="chat"/></li>
                <li><font-awesome-icon icon="users" title="通讯录" @click="contacts"/></li>
                <li><font-awesome-icon :icon="['fas', 'eye']" title="朋友圈" @click="tocsdn"/></li>
                <li><font-awesome-icon icon="star" title="收藏夹" @click="togithub"/></li>
            </ul>
        </div>
        <div class="privacy"><div class="avatar" @click="logout"><img :src="avatar" alt=""></div></div>
    </div>
</template>

<script setup>
import {ref} from 'vue'
import { onMounted } from 'vue'
import axios from 'axios'   
const emit = defineEmits(['showchat','showcontacts',"todetail"])

const avatar = ref("")

function toAI(){
    emit("todetail","打开AI小助手")
}

function chat(){
    emit('showchat','打开聊天')
}
function contacts(){
    emit("showcontacts","打开联系人")
}

function tocsdn(){
    const url = "https://blog.csdn.net/lnvb596914531?spm=1000.2115.3001.5343"
    window.open(url,"_blank")
}

function togithub(){
    const url = "https://github.com/Marco-Reus-11/Coffee-Chat-Bar"
    window.open(url,"_blank")
}

function logout(){
    localStorage.clear()
    location.reload()
}
onMounted(async()=>{
    try{
        const token = localStorage.getItem("token")
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/info`, {
        headers: {
            authorization: `Bearer ${token}`
        }
        })
        avatar.value = res.data.ava
    }
    catch(err){
        console.error("用户头像获取失败：",err)
    }
})

</script>

<style scoped>
    *{
        padding: 0;
        margin: 0;
    }
    .sidebar{
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .logo{
        flex:1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        /* border-bottom: 1px solid red; */
        -webkit-app-region: no-drag
    }

    .logo img:hover{
        border-radius: 50%;
        box-shadow: 0 0 5px 1px rgba(0,0,0,.5);
        cursor: pointer;
    }

    .toolbar{
        flex:1 1 40%;
        -webkit-app-region: no-drag
        /* border: 1px solid blue; */
    }
    .privacy{
        flex: 1;
        /* border: 1px solid green; */
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        /* border-bottom: 1px solid red; */
    }
    img{
        width: 100%;
        aspect-ratio: 1/1;
        object-fit: cover;
    }
    ul{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    li{
        width: 100%;
        list-style-type: none;
        /* border: 1px solid brown; */
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    svg{
        color: rgba(165, 42, 42, 0.485);
        font-size: 25px;
    }

    svg:hover{
        filter: drop-shadow(0 0 5px rgba(0,0,0,.5));
        cursor: pointer;
    }

    .avatar{
        width: 60%;
        border: 1px solid rgba(0,0,0,.5);
        border-radius: 50%;
        overflow: hidden;
        margin-bottom: 10%;
        aspect-ratio: 1/1;
        position: relative;
        -webkit-app-region: no-drag
    }
    .avatar:hover{
        box-shadow: 0 0 5px 2px rgba(0,0,0,.5);
        cursor: pointer;
    }

    .avatar::after{
        content: "退出登录";
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background-color: gray;
        display: flex;
        justify-content: center;
        align-items: center;
        white-space: nowrap;
        font-size: small;
        opacity: 0;
        transition: opacity 0.5s ease;
        pointer-events: none;
    }

    .avatar:hover::after{
        opacity: 1;
    }

    @media(min-width:1300px) {
        .sidebar{
            border-radius: 0;
        }

        .logo img{
            border-radius: 0;
        }
    }
</style>