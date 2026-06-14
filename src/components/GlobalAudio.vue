<template>
  <audio
    ref="audioRef"
    :src="player.currentSong?.url"
    @timeupdate="onTimeUpdate"
    @loadedmetadata="onLoadedMetadata"
    @ended="onEnded"
  ></audio>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { usePlayerStore } from '../store/player'

const player = usePlayerStore()
const audioRef = ref(null)

const playAudio = async () => {
  await nextTick()

  if (audioRef.value && player.currentSong) {
    try {
      await audioRef.value.play()
      player.isPlaying = true
    } catch (error) {
      console.log('播放失败：', error)
      player.isPlaying = false
    }
  }
}

const pauseAudio = () => {
  if (audioRef.value) {
    audioRef.value.pause()
  }
}

watch(
  audioRef,
  (audio) => {
    if (audio) {
      player.setAudio(audio)
    }
  },
  { immediate: true }
)

watch(
  () => player.isPlaying,
  (playing) => {
    if (playing) {
      playAudio()
    } else {
      pauseAudio()
    }
  }
)

watch(
  () => player.currentSong?.url,
  async () => {
    await nextTick()

    if (audioRef.value) {
      audioRef.value.load()
    }

    if (player.isPlaying) {
      playAudio()
    }
  }
)

const onTimeUpdate = () => {
  if (!audioRef.value) return

  player.currentTime = audioRef.value.currentTime
  player.duration = audioRef.value.duration || 0

  if (player.duration > 0) {
    player.progress = (player.currentTime / player.duration) * 100
  }

  player.updateCurrentLyric()
}

const onLoadedMetadata = () => {
  if (!audioRef.value) return
  player.duration = audioRef.value.duration || 0
}

const onEnded = () => {
  if (player.playMode === 'single') {
    audioRef.value.currentTime = 0
    playAudio()
  } else {
    player.nextSong()
  }
}

onMounted(() => {
  if (audioRef.value) {
    player.setAudio(audioRef.value)
  }
})
</script>