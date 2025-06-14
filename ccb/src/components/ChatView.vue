<template>
    <div class="container mobile" ref="container" v-if="isMobile">
        <div class="section2 mobile" v-if="!showcontent"><LastChats  @hidechat="handlehidechat" @changecolor="setcolor" @todetail="showdetail"/></div>
        <router-view class="section3" v-if="showcontent" @closemessage="hidecontent"/>
        <!-- <div class="section3" v-if="show3"><Content @closemessage="handleclosemessage"/></div> -->
         <!-- 隐藏聊天内容的叉叉要到其它地方不上 -->
         <!-- <router-view class="section3" v-if="showcontent" @closemessage="hidecontent"/> -->
    </div>
    <div class="container" ref="container" v-else>
        <div class="section1"><Sidebar @showchat="handleshowchat" @showcontacts="handleshowcontacts" @todetail="showAI"/></div>
        <div class="section2" v-if="showlastchats"><LastChats  @hidechat="handlehidechat" @changecolor="setcolor" @todetail="showdetail"/></div>
        <div class="section2" v-if="showcontacts"><Contacts  @hidecontacts="handlehidecontacts" @todetail="showdetail"/></div>
        <!-- <div class="section3" v-if="show3"><Content @closemessage="handleclosemessage"/></div> -->
         <!-- 隐藏聊天内容的叉叉要到其它地方不上 -->
         <router-view class="section3" v-if="showcontent" @closemessage="hidecontent"/>
    </div>
</template>

<script setup>
    import Sidebar from './Sidebar.vue'
    import LastChats from './LastChats.vue'
    import Contacts from './Contacts.vue'
    import { onMounted, ref, watch} from 'vue'
    import { nextTick } from 'vue'
    import { useRouter } from 'vue-router'

    const theme = ref('beige')
    const container = ref(null)
    const router = useRouter()

    const showlastchats = ref(true)
    const showcontacts = ref(false)
    const showcontent = ref(false)

    const isMobile = ref(false)

//这里处理contacts板块的显示和隐藏
    function handlehidechat(message){
        console.log(message)
        showlastchats.value = false
    }
    function handleshowchat(message){
        console.log(message)
        showlastchats.value = true
        showcontacts.value = false
    }

//这里处理contacts板块的显示和隐藏
    function handleshowcontacts(message){
        console.log(message)
        showlastchats.value = false
        showcontacts.value = true
    }

    function handlehidecontacts(message){
        console.log(message)
        showcontacts.value = false
    }

    function setcolor(data){
        theme.value = data.color
        container.value.setAttribute('data-theme',theme.value)
    }

    //显示聊天内容
    function showdetail(data){
        showcontent.value=true
        const uname = data.uname
        const img = data.img
        router.push({
            path:"/chatdetail",
            query:{uname,img}
        })
    }

    function showAI(){
        showcontent.value = true
        router.push({
            path:"/chat-ai"
        })
    }

    function hidecontent(){
        if(showcontent.value){
            showcontent.value = false
        }
    }

    function checkScreen(){
        isMobile.value = window.innerWidth<=768
    }

    onMounted(()=>{
        checkScreen()
        window.addEventListener("resize",checkScreen)
        nextTick(()=>{
            container.value.setAttribute('data-theme',theme.value)
        })
    })

</script>

<style scoped>
/* 换肤的颜色库 */
    [data-theme="beige"] {
    --bg-color: #f9f9f9;
    --text-color: #444444;
    }

    /* 晴空蓝白 */
    [data-theme="mist"] {
    --bg-color: rgba(220, 225, 230, 1);
    --text-color: #2c3e50;
    }

    /* 杏仁橙色，或者说是杏黄色 */
    [data-theme="apricot"] {
    --bg-color: rgba(255, 235, 215, 1);
    --text-color: #5c4033;
    }

    .container{
        /* margin: 5vh 10vw; */
        border-radius: 1rem;
        flex: 1;
        display: flex;
        box-shadow: 0 0 5px 1px rgba(0,0,0,.5);
        -webkit-app-region: drag;
        max-height: 100vh;
        background: var(--bg-color);
        color: var(--text-color);
        transition: all 1.5s ease-in;
    }
    
    .section1,.section2,.section3{
        max-height: 100%;
        border-radius: 1rem;
        background-color: transparent;
    }
    .section1{
        flex: 0 0 8%;
    }
    .section2{
        flex: 0 0 30%;
        border: 1px solid gray;
        border-top: none;
        border-bottom: none;
        overflow: hidden;
        box-sizing: border-box;
        /* display: flex; */
    }
    .section3{
        flex: 1 1 62%;
    }

    .mobile{
        flex: 1;
        transition: all 0s;
        border: none;
        border-radius: 0;
    }


    /* 媒体查询适应移动端 */
     /* @media (max-width: 768px) {
    .section1,.section3{
        display: none;
    }
    .section2{
        flex: 1;
        border: none;
        border-radius: 0;
    }
    .container{
        border-radius: 0;
    }
    } */
    @media (min-width: 1300px){
    .container{
        margin: 5vh 10vw;
    }
}

@media (max-width: 1200px){
    .container{
        border-radius: 0;
    }
    .section1{
        border-radius: 0;
}}

</style>