<template>
  <div class="song-list">
    <div class="header">
      <van-nav-bar
        title="歌单详情"
        left-arrow
        @click-left="$router.back()"
      />

      <div class="playlist-info">
        <img class="playlist-cover" :src="playlistCover" />

        <div class="playlist-text">
          <div class="playlist-title">精选音乐歌单</div>
          <div class="playlist-desc">为你推荐当下热门歌曲</div>
          <div class="playlist-count">
            共 {{ filterSongList.length }} 首歌曲
          </div>
        </div>
      </div>

      <van-search
        v-model="keyword"
        placeholder="搜索歌曲 / 歌手"
        shape="round"
        background="transparent"
      />

      <div class="play-all" @click="playAll">
        <van-icon name="play-circle-o" size="24" />
        <span>播放全部</span>
      </div>
    </div>

    <div v-if="loading" class="loading-box">
      <van-loading type="spinner">加载歌曲中...</van-loading>
    </div>

    <van-empty
      v-else-if="filterSongList.length === 0"
      description="没有找到相关歌曲"
    />

    <div v-else class="song-container">
      <div
        v-for="(song, index) in filterSongList"
        :key="song.id"
        class="song-card"
        :class="{ active: player.currentSong?.id === song.id }"
        @click="playSong(song)"
      >
        <div class="rank">
          {{ index + 1 }}
        </div>

        <img class="song-cover" :src="song.cover" />

        <div class="song-info">
          <div class="song-name">{{ song.name }}</div>
          <div class="song-singer">{{ song.singer }}</div>
        </div>

        <van-icon
          v-if="player.currentSong?.id === song.id"
          name="volume-o"
          class="playing-icon"
        />

        <van-icon
          v-else
          name="play-circle-o"
          class="playing-icon"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { usePlayerStore } from '../store/Player'

const router = useRouter()
const route = useRoute()
const player = usePlayerStore()

const loading = ref(false)
const keyword = ref(route.query.keyword || '')

const playlistCover = 'https://picsum.photos/300/300?random=88'

const filterSongList = computed(() => {
  const key = keyword.value.trim().toLowerCase()

  if (!key) return player.songList

  return player.songList.filter(song => {
    return (
      song.name.toLowerCase().includes(key) ||
      song.singer.toLowerCase().includes(key)
    )
  })
})

const playSong = (song) => {
  player.setCurrentSong(song)
  player.pause()
  router.push('/play')
}

const playAll = () => {
  if (!filterSongList.value.length) {
    showToast('暂无可播放歌曲')
    return
  }

  const firstSong = filterSongList.value[0]
  player.setCurrentSong(firstSong)
  player.play()
  router.push('/play')
}

onMounted(async () => {
  loading.value = true

  try {
    await player.loadSongList()
  } catch (error) {
    showToast('歌曲加载失败')
  }

  loading.value = false
})
</script>

<style scoped>
.song-list {
  min-height: 100vh;
  padding-bottom: 130px;
  background:
    radial-gradient(circle at 10% 0%, rgba(139, 92, 246, 0.18), transparent 28%),
    radial-gradient(circle at 90% 0%, rgba(236, 72, 153, 0.16), transparent 28%),
    #f7f8fa;
}

.header {
  padding-bottom: 20px;
  border-radius: 0 0 32px 32px;
  background: linear-gradient(135deg,  #7c2d12,  #f97316,  #fbbf24);
  color: #fff;
  box-shadow: 0 14px 35px rgba(79, 70, 229, 0.28);
}

.playlist-info {
  display: flex;
  align-items: center;
  padding: 20px 18px 14px;
}

.playlist-cover {
  width: 98px;
  height: 98px;
  border-radius: 22px;
  object-fit: cover;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);
}

.playlist-text {
  margin-left: 16px;
}

.playlist-title {
  font-size: 23px;
  font-weight: 900;
}

.playlist-desc {
  margin-top: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.72);
}

.playlist-count {
  margin-top: 12px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.82);
}

.play-all {
  margin: 12px 18px 0;
  height: 46px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  font-size: 15px;
  font-weight: 800;

  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.loading-box {
  margin-top: 100px;
  text-align: center;
}

.song-container {
  padding: 18px 14px;
}

.song-card {
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 22px;

  display: flex;
  align-items: center;

  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.07);
}

.song-card.active {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.16), rgba(236, 72, 153, 0.12));
  border: 1px solid rgba(139, 92, 246, 0.25);
}

.rank {
  width: 30px;
  font-size: 18px;
  font-weight: 900;
  color: #8b5cf6;
}

.song-cover {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  object-fit: cover;
  margin-right: 12px;
}

.song-info {
  flex: 1;
  min-width: 0;
}

.song-name {
  font-size: 16px;
  font-weight: 900;
  color: #111827;
}

.song-singer {
  margin-top: 5px;
  font-size: 12px;
  color: #6b7280;
}

.playing-icon {
  color: #8b5cf6;
  font-size: 24px;
}
</style>