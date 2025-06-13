<template>
  <router-view/>
</template>

<script setup>
  import ChatView from './components/ChatView.vue'
</script>

<style>

html, body, #app {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  background-color: white;
  /* background-color: transparent; */
  overflow: hidden;
  /* border-radius: 1rem; */
  box-sizing: border-box;
}

@media(maxwidth:768px){
  html,body,#app{
    border-radius: 0;
  }
}
</style>