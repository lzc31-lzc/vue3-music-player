<template>
  <div class="play">
    <div
      v-if="player.currentSong"
      class="bg-blur"
      :style="{ backgroundImage: `url(${player.currentSong.cover})` }"
    ></div>

    <van-nav-bar title="正在播放" left-arrow @click-left="$router.back()" />

    <div v-if="player.currentSong" class="content">
      <div class="switch-tip">
        {{ showLyric ? '点击歌词返回封面' : '点击封面查看歌词' }}
      </div>

      <div v-if="!showLyric" class="cover-view">
        <div class="cover-card" @click="showLyric = true">
          <div class="disk" :class="{ rotate: player.isPlaying }">
            <img :src="player.currentSong.cover" alt="歌曲封面" />
          </div>
        </div>
      </div>

      <div
        v-else
        ref="lyricPanelRef"
        class="lyric-panel lyric-full"
        @click="showLyric = false"
      >
        <div
          v-for="(item, index) in player.lyricList"
          :key="index"
          class="lyric-line"
          :class="{ active: index === player.currentLyricIndex }"
        >
          {{ item.text }}
        </div>
      </div>

      <div class="song-name">{{ player.currentSong.name }}</div>
      <div class="singer">{{ player.currentSong.singer }}</div>

      <div class="progress-box">
        <van-slider
          v-model="player.progress"
          active-color="#a78bfa"
          inactive-color="rgba(255,255,255,0.45)"
          @change="changeProgress"
        />

        <div class="time-row">
          <span>{{ currentTimeText }}</span>
          <span>{{ durationText }}</span>
        </div>
      </div>

      <div class="control">
        <van-icon name="arrow-left" size="36" @click="player.prevSong()" />

        <div class="play-main" @click="player.togglePlay()">
          <van-icon :name="player.isPlaying ? 'pause' : 'play'" size="38" />
        </div>

        <van-icon name="arrow" size="36" @click="player.nextSong()" />
      </div>

      <div class="extra-control">
        <van-icon
          :name="favoriteIcon"
          size="28"
          @click="player.toggleFavorite(player.currentSong)"
        />

        <div class="mode" @click="player.togglePlayMode()">
          {{ modeText }}
        </div>
      </div>
    </div>

    <div v-else class="empty">
      <van-empty description="还没有选择歌曲" />
      <van-button type="primary" round @click="$router.push('/songlist')">
        去选择歌曲
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { usePlayerStore } from '../store/Player'

const player = usePlayerStore()
const showLyric = ref(false)
const lyricPanelRef = ref(null)

const formatTime = (time) => {
  if (!time || isNaN(time)) return '00:00'

  const minute = Math.floor(time / 60)
  const second = Math.floor(time % 60)

  return `${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`
}

const currentTimeText = computed(() => formatTime(player.currentTime))
const durationText = computed(() => formatTime(player.duration))

const modeText = computed(() => {
  if (player.playMode === 'order') return '顺序播放'
  if (player.playMode === 'single') return '单曲循环'
  return '随机播放'
})

const favoriteIcon = computed(() => {
  return player.isFavorite(player.currentSong) ? 'like' : 'like-o'
})

const changeProgress = (value) => {
  player.changeProgress(value)
}

watch(
  () => player.currentLyricIndex,
  async (index) => {
    await nextTick()

    const panel = lyricPanelRef.value
    if (!panel) return

    const activeLine = panel.children[index]
    if (!activeLine) return

    panel.scrollTo({
      top:
        activeLine.offsetTop -
        panel.clientHeight / 2 +
        activeLine.clientHeight / 2,
      behavior: 'smooth'
    })
  }
)

watch(
  () => player.currentSong?.id,
  async () => {
    showLyric.value = false

    await nextTick()

    if (lyricPanelRef.value) {
      lyricPanelRef.value.scrollTop = 0
    }
  }
)
</script>

<style scoped>
.play {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: linear-gradient(160deg, #111827, #312e81, #7c2d12);
}

.bg-blur {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: blur(34px);
  opacity: 0.32;
  transform: scale(1.22);
}

.content {
  position: relative;
  z-index: 2;
  padding: 34px 22px 140px;
  text-align: center;
  color: #fff;
}

.switch-tip {
  margin-bottom: 16px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.62);
}

.cover-view {
  height: 295px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-card {
  width: 268px;
  height: 268px;
  padding: 18px;
  border-radius: 36px;
  background: rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(18px);
  box-shadow:
    0 24px 48px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.22);
}

.disk {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  border: 12px solid rgba(17, 24, 39, 0.95);
  animation: rotateDisk 12s linear infinite;
  animation-play-state: paused;
}

.disk.rotate {
  animation-play-state: running;
}

.disk img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lyric-panel {
  height: 295px;
  overflow-y: auto;
  padding: 18px 20px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
}

.lyric-panel::-webkit-scrollbar {
  display: none;
}

.lyric-full {
  margin: 0 auto;
  max-width: 340px;
  background: rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 18px 36px rgba(0, 0, 0, 0.16);
}

.lyric-line {
  padding: 13px 0;
  color: rgba(255, 255, 255, 0.43);
  font-size: 15px;
  line-height: 1.5;
  transition: all 0.3s;
}

.lyric-line.active {
  color: #fff;
  font-size: 22px;
  font-weight: 900;
  transform: scale(1.05);
  text-shadow: 0 0 18px rgba(255, 255, 255, 0.28);
}

.song-name {
  margin-top: 18px;
  font-size: 26px;
  font-weight: 900;
}

.singer {
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 15px;
  margin-bottom: 30px;
}

.progress-box {
  width: 92%;
  margin: 0 auto 32px;
}

.time-row {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.72);
}

.control {
  width: 280px;
  margin: 0 auto 26px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.play-main {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 14px 30px rgba(236, 72, 153, 0.35);
}

.extra-control {
  width: 220px;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.mode {
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(14px);
}

.empty {
  position: relative;
  z-index: 2;
  padding-top: 80px;
  text-align: center;
}

@keyframes rotateDisk {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>