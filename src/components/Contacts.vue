<template>
    <div class="contacts">
        <div class="top">
            <div class="top_child">
                <input type="button" value="◁" @click="back" id="button">
                <span>Chat</span>
            </div>
        </div>
        <div class="middle">
            <div class="setting"><font-awesome-icon :icon="['fas', 'gear']" /></div>
            <div class="avatar">
                <div class="frame">
                    <img src="../images/avatar.jpg" alt="">
                </div>
            </div>
            <div class="username">空佬的z字帽杀</div>
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
                <li class="chat-item" style="background-color: rgba(0,0,0,.05);" @click="callup">
                    <div class="avatar-small"><img src="../images/anuo.png" alt=""></div>
                    <div class="detail">
                        <div class="name">一条11408的狗</div>
                        <div class="info">哥们，上号啊！</div>
                    </div>
                    <div class="time">{{time}}</div>
                </li>
                <li class="chat-item">
                    <div class="avatar-small"><img src="../images/art2.jpg" alt=""></div>
                    <div class="tips">3</div>
                    <div class="detail">
                        <div class="name">老妈</div>
                        <div class="info"><strong style="color: red;">【红包】</strong>6月生活费</div>
                    </div>
                    <div class="time">{{time}}</div>
                </li>
                <li class="chat-item">
                    <div class="avatar-small">
                        <img src="../images/fangdatong.webp" alt="">
                    </div>
                    <div class="tips">1</div>
                    <div class="detail">
                        <div class="name">回到未来</div>
                        <div class="info">周末出来吃饭吗？</div>
                    </div>
                    <div class="time">{{time}}</div>
                </li>
                <li class="chat-item">
                    <div class="avatar-small"><img src="../images/avatar.jpg" alt=""></div>
                    <div class="detail">
                        <div class="name">我</div>
                        <div class="info">Python:100个小白练手项目，全部做完你将成为编程糕手！</div>
                    </div>
                    <div class="time">{{time}}</div>
                </li>
                <!-- <li class="chat-item">
                    <div class="avatar-small"><img src="../images/avatar.jpg" alt=""></div>
                    <div class="detail">
                        <div class="name">我是11408的狗</div>
                        <div class="info">哥们，上号啊！</div>
                    </div>
                    <div class="time">{{time}}</div>
                </li> -->
            </ul>
        </div>
        <!-- <div class="privacy"><div class="avatar"><img src="../images/avatar.jpg" alt=""></div></div> -->
    </div>
</template>

<script setup>
import {ref} from 'vue'
// import { useRoute,useRouter } from 'vue-router';
// const route = useRoute()
// const router = useRouter()
let time = ref(new Date().toLocaleString().slice(9,15))
const statu = ref("available")
const emit = defineEmits(["hidechat","showdetail"])
function back() {
    emit("hidechat","关掉聊天")
}
function callup(){
    emit("showdetail")
}
</script>

<style scoped>
:root {
    --primary-color: #4CAF50;
    --border-color: rgba(0, 0, 0, 0.1);
    --shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.contacts {
    height: 100%;
    min-width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
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

#button,.status,.search,.setting,.avatar,.chat-list{
    -webkit-app-region: no-drag
}

.top_child {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
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
    background-color: rgba(0, 0, 0, 0.05);
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

.username {
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

.avatar-small {
    width: 48px;
    height: 48px;
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
    top: 10%;
    left: 15%;
    background-color: red;
    border-radius: 50%;
    height: 20%;
    aspect-ratio: 1/1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: small;
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

/* 响应式设计 */
@media (max-width: 768px) {
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
        width: 350px;
        border-right: 1px solid var(--border-color);
    }
}
</style>