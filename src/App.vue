<template>
  <div class="app">
    <router-view />

    <GlobalAudio />

    <MiniPlayer />

    <TabBar />
  </div>
</template>

<script setup>
import TabBar from './components/TabBar.vue'
import MiniPlayer from './components/MiniPlayer.vue'
import GlobalAudio from './components/GlobalAudio.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  height: 100%;
}

.app {
  min-height: 100vh;
  padding-bottom: 120px;
  background: #f7f8fa;
}
</style>