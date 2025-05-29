<template>
    <div class="sidebar">
        <div class="logo"><img src="../images/logo.png" alt=""></div>
        <div class="toolbar">
            <ul>
                <li><font-awesome-icon icon="comment" title="聊天" @click="chat"/></li>
                <li><font-awesome-icon icon="users" title="通讯录"/></li>
                <li><font-awesome-icon :icon="['fas', 'eye']" title="朋友圈"/></li>
                <li><font-awesome-icon icon="star" title="收藏夹"/></li>
            </ul>
        </div>
        <div class="privacy"><div class="avatar"><img src="../images/avatar.jpg" alt=""></div></div>
    </div>
</template>

<script setup>
import {ref} from 'vue'
const emit = defineEmits(['showchat'])
function chat(){
    emit('showchat','打开聊天')
}
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
        -webkit-app-region: no-drag
    }
    .avatar:hover{
        box-shadow: 0 0 5px 2px rgba(0,0,0,.5);
        cursor: pointer;
    }

</style>