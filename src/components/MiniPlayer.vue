<template>
  <div
    v-if="player.currentSong"
    class="mini-player"
    @click="goPlay"
  >
    <img
      class="cover"
      :class="{ rotate: player.isPlaying }"
      :src="player.currentSong.cover"
      alt=""
    />

    <div class="info">
      <div class="name">{{ player.currentSong.name }}</div>
      <div class="singer">{{ player.currentSong.singer }}</div>

      <div class="progress">
        <div
          class="progress-inner"
          :style="{ width: player.progress + '%' }"
        ></div>
      </div>
    </div>

    <van-icon
      class="play-btn"
      :name="player.isPlaying ? 'pause-circle-o' : 'play-circle-o'"
      size="36"
      @click.stop="player.togglePlay()"
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { usePlayerStore } from '../store/Player'

const router = useRouter()
const player = usePlayerStore()

const goPlay = () => {
  router.push('/play')
}
</script>

<style scoped>
.mini-player {
  position: fixed;
  left: 14px;
  right: 14px;
  bottom: 64px;
  height: 70px;
  z-index: 999;

  display: flex;
  align-items: center;
  padding: 10px 14px;

  border-radius: 22px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(18px);
  box-shadow:
    0 12px 32px rgba(15, 23, 42, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.cover {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  object-fit: cover;
  margin-right: 12px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.16);
  animation: rotateCover 10s linear infinite;
  animation-play-state: paused;
}

.cover.rotate {
  animation-play-state: running;
}

.info {
  flex: 1;
  min-width: 0;
}

.name {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.singer {
  margin-top: 4px;
  font-size: 12px;
  color: #6b7280;
}

.progress {
  margin-top: 8px;
  height: 4px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
}

.progress-inner {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #6366f1, #ec4899);
}

.play-btn {
  margin-left: 12px;
  color: #4f46e5;
}

@keyframes rotateCover {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>