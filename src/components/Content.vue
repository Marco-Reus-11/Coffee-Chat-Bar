<template>
    <div class="box">
            <div class="main">
                <div class="top">
                    <h4>一条11408的狗</h4>
                    <button @click="muted">{{disturb?"🔊":"🔇"}}</button>
                    <button class="off" @click="offmessage">✖</button>
                </div>
                <div class="middle" ref="messageList">
                    <ul>
                        <li class="message" v-for="message in messages"  :key="id">
                                <div class="avatar" v-if="message.char==='opposite'"><img src="../images/anuo.png" alt=""></div>
                                <div class="text" :class="{me:message.char==='me'}">
                                    <div class="content">{{message.words}}</div>
                                </div>
                        </li>
                    </ul>
                </div>
                <div class="bottom">
                    <div class="send">
                        <button>😋</button>
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
const messages = ref([
    {id:1,words:"人呢",char:"opposite"},
    {id:2,words:"？",char:"opposite"},
    {id:3,words:"？",char:"opposite"},
    {id:4,words:"？",char:"opposite"},
    {id:5,words:"？",char:"opposite"},
    {id:6,words:"哥们，上号啊！",char:"opposite"}
])
const messageList = ref(null)
const new_message = ref("")
const disturb = ref(true)
onMounted(()=>{
    const el = messageList.value
    if(el){
            el.scrollTop = el.scrollHeight
        }
})
function send(e) {
    e.preventDefault()
    if (new_message.value) {
        messages.value.push({id:messages.length+1,words:new_message.value,char:"me"})
        new_message.value = ''
        nextTick(()=>{
            const el = messageList.value
            if(el){
                el.scrollTop = el.scrollHeight
            }
        })
    }
    else{
        alert("输入内容不能为空！")
    }
}

function muted(){
    disturb.value = !disturb.value
}

const emit = defineEmits(['closemessage'])
function offmessage(){
    emit('closemessage')
}
</script>

<style scoped>
    .box{
        width: 96%;
        height: 92vh;
        padding: 4vh 2%;
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
        overflow: scroll;
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
</style>