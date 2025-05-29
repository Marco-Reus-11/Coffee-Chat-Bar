<template>
    <div class="container">
        <div class="section1"><Sidebar @showchat="handleshowchat"/></div>
        <div class="section2" v-if="show2"><Contacts  @hidechat="handlehidechat" @showdetail="handleshowdetail"/></div>
        <div class="section3" v-if="show3"><Content @closemessage="handleclosemessage"/></div>
        <!-- <div class="otto" v-if="showotto"><img src="../images/otto.png" alt=""><div>我畅诉你的码——码农聊天室</div></div> -->
    </div>
</template>

<script setup>
    import Sidebar from './Sidebar.vue'
    import Contacts from './Contacts.vue'
    import Content from './Content.vue'
    import { ref, watch} from 'vue'
    // const section1 = ref(null)
    const show2 = ref(true)
    const show3 = ref(true)
    const showotto = ref(false)
    function handlehidechat(message){
        console.log(message)
        show2.value = false
    }
    function handleshowchat(message){
        console.log(message)
        show2.value = true
    }
    function handleclosemessage(){
        show3.value = false
    }
    function handleshowdetail(){
        show3.value = true
    }

    watch([()=>show2.value,()=>show3.value],([newValue1,newValue2])=>{
        if(newValue1===false&&newValue2===false)
        {
            showotto.value = true
        }
        else{
            showotto.value = false
        }
    })

</script>

<style scoped>
/* 这里是原样式！ */
    /* .container{
        margin: 5vh 10vw;
        border-radius: 1rem;
        flex: 1;
        display: flex;
        box-shadow: 0 0 5px 1px rgba(0,0,0,.5);
    } */
    
    .container{
        /* margin: 5vh 10vw; */
        border-radius: 1rem;
        flex: 1;
        display: flex;
        box-shadow: 0 0 5px 1px rgba(0,0,0,.5);
        -webkit-app-region: drag;
    }
    
    .section1,.section2,.section3{
        flex: 1;
        border-radius: 1rem;
        background-color: transparent;
    }
    .section1{
        flex: 0 1 8%;
    }
    .section2{
        flex: 0 1 30%;
        border: 1px solid gray;
        border-top: none;
        border-bottom: none;
        /* display: flex; */
    }
    .section3{
        flex: 1;
    }
    .otto{
        max-height: 100vh;
        width: auto;
        position: absolute;
        left: 15%;
        top: 6%;
        pointer-events: none;
        /* overflow: hidden; */
    }
    .otto div{
        position: absolute;
        width: 100%;
        /* background-color: red; */
        text-align: center;
        pointer-events: none;
        font-size: 50px;
        transform: translateY(-20px);
    }
    @keyframes startle{
        0% {transform: scale(0.5);}
        100% {transform: scale(1.2);}
    }
    .otto img{
        height: 600px;
        animation: startle 3s ease forwards;
    }
</style>