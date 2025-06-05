<template>
  <ChatView/>
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
  background-color: #f9f9f9;
  /* background-color: transparent; */
  overflow: hidden;
  border-radius: 1rem;
}
</style>