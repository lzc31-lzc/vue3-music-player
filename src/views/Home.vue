<template>
  <div class="page home-page">
    <section class="home-hero">
      <div class="hero-top">
        <div>
          <p class="hello">{{ greeting }}</p>
          <h1>发现今天适合你的音乐</h1>
        </div>

        <div class="notice-btn">
          <van-icon name="bell" size="22" />
        </div>
      </div>

      <van-search
        v-model="keyword"
        placeholder="搜索歌曲 / 歌手"
        shape="round"
        background="transparent"
        @search="handleSearch"
      />

      <div class="daily-card">
        <div>
          <p>Daily Mix</p>
          <h2>今日私人推荐</h2>
          <span>根据你的播放喜好生成</span>
        </div>

        <van-button round size="small" class="play-btn" @click="playDaily">
          立即播放
        </van-button>
      </div>
    </section>

    <section class="section-block">
      <div class="section-title">
        <h2>热门榜单</h2>
        <span>更多</span>
      </div>

      <div class="rank-list">
        <div
          v-for="item in ranks"
          :key="item.id"
          class="rank-card card-hover"
          @click="goSongList(item.title)"
        >
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </div>
          <img :src="item.cover" />
        </div>
      </div>
    </section>

    <section class="section-block">
      <div class="section-title">
        <h2>推荐歌单</h2>
        <span @click="changePlaylists">换一批</span>
      </div>

      <div class="playlist-grid">
        <div
          v-for="item in playlists"
          :key="item.id"
          class="playlist-card card-hover"
          @click="goSongList(item.title)"
        >
          <div class="cover-wrap">
            <img :src="item.cover" />
            <span class="play-count">
              <van-icon name="play-circle-o" />
              {{ item.count }}
            </span>
          </div>
          <div class="playlist-info">
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section-block">
      <div class="section-title">
        <h2>热门歌曲</h2>
        <span @click="playAll">播放全部</span>
      </div>

      <van-cell-group inset class="song-panel">
        <van-cell
          v-for="(song, index) in hotSongs"
          :key="song.id"
          :title="song.name"
          :label="song.singer"
          is-link
          @click="playSong(song)"
        >
          <template #icon>
            <div class="song-index">{{ index + 1 }}</div>
          </template>
        </van-cell>
      </van-cell-group>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { usePlayerStore } from '../store/player'

const router = useRouter()
const player = usePlayerStore()

const keyword = ref('')

const greeting = computed(() => {
  const hour = new Date().getHours()

  if (hour < 6) return '夜深了，听点轻音乐吧'
  if (hour < 12) return '早上好，欢迎回来'
  if (hour < 18) return '下午好，欢迎回来'
  return '晚上好，欢迎回来'
})

const ranks = ref([
  {
    id: 1,
    title: '飙升榜',
    desc: '热度增长最快',
    cover: 'https://picsum.photos/160/160?random=41'
  },
  {
    id: 2,
    title: '新歌榜',
    desc: '新鲜好歌速递',
    cover: 'https://picsum.photos/160/160?random=42'
  },
  {
    id: 3,
    title: '热歌榜',
    desc: '全站热门歌曲',
    cover: 'https://picsum.photos/160/160?random=43'
  }
])

const playlists = ref([
  {
    id: 1,
    title: '深夜情绪馆',
    desc: '适合一个人安静听',
    cover: 'https://picsum.photos/600/320?random=1',
    count: '32万'
  },
  {
    id: 2,
    title: '学习专注BGM',
    desc: '沉浸式学习音乐',
    cover: 'https://picsum.photos/600/320?random=2',
    count: '18万'
  },
  {
    id: 3,
    title: '华语流行精选',
    desc: '循环播放也不腻',
    cover: 'https://picsum.photos/600/320?random=3',
    count: '56万'
  },
  {
    id: 4,
    title: '城市夜跑节奏',
    desc: '跑步通勤都适合',
    cover: 'https://picsum.photos/600/320?random=4',
    count: '12万'
  }
])

const hotSongs = ref([
  {
    id: 1,
    name: '晴天',
    singer: '周杰伦',
    cover: 'https://picsum.photos/300/300?random=11'
  },
  {
    id: 2,
    name: '夜曲',
    singer: '周杰伦',
    cover: 'https://picsum.photos/300/300?random=12'
  },
  {
    id: 3,
    name: '稻香',
    singer: '周杰伦',
    cover: 'https://picsum.photos/300/300?random=13'
  }
])

const handleSearch = () => {
  if (!keyword.value.trim()) {
    showToast('请输入搜索内容')
    return
  }

  router.push({
    path: '/songlist',
    query: {
      keyword: keyword.value
    }
  })
}

const goSongList = (title) => {
  router.push({
    path: '/songlist',
    query: {
      title
    }
  })
}

const playSong = (song) => {
  player.setCurrentSong(song)
  router.push('/play')
}

const playDaily = () => {
  playSong(hotSongs.value[0])
}

const playAll = () => {
  playDaily()
}

const changePlaylists = () => {
  playlists.value = [...playlists.value].reverse()
  showToast('已换一批')
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  padding-bottom: 88px;
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.16), transparent 30%),
    radial-gradient(circle at top right, rgba(168, 85, 247, 0.14), transparent 30%),
    #f6f7fb;
}

.home-hero {
  position: relative;
  padding: 26px 14px 18px;
  border-radius: 0 0 32px 32px;
  color: #fff;
  overflow: hidden;
  background:
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.25), transparent 26%),
    linear-gradient(135deg, #111827 0%, #2563eb 52%, #22d3ee 100%);
}

.home-hero::after {
  content: "";
  position: absolute;
  width: 240px;
  height: 240px;
  top: -80px;
  right: -70px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.14);
}

.hero-top {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hello {
  margin: 0 0 6px;
  font-size: 14px;
  opacity: 0.9;
}

.hero-top h1 {
  margin: 0;
  font-size: 25px;
  font-weight: 900;
}

.notice-btn {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.16);
}

.daily-card {
  position: relative;
  z-index: 1;
  margin-top: 18px;
  padding: 18px;
  border-radius: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  background: rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.28);
}

.daily-card p,
.daily-card h2,
.daily-card span {
  margin: 0;
}

.daily-card p {
  font-size: 12px;
  opacity: 0.78;
}

.daily-card h2 {
  margin: 6px 0;
  font-size: 22px;
  font-weight: 900;
}

.daily-card span {
  font-size: 12px;
  opacity: 0.82;
}

.play-btn {
  border: none;
  color: #fff;
  font-weight: 700;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
}

.section-block {
  margin-top: 22px;
}

.section-title {
  padding: 0 14px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 900;
  color: #111827;
}

.section-title span {
  font-size: 13px;
  color: #7c3aed;
  font-weight: 700;
}

.rank-list {
  padding: 0 14px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.rank-card {
  padding: 14px;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
}

.rank-card h3 {
  margin: 0 0 6px;
  font-size: 15px;
  color: #111827;
}

.rank-card p {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}

.rank-card img {
  width: 50px;
  height: 50px;
  border-radius: 16px;
  object-fit: cover;
}

.playlist-grid {
  padding: 0 14px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.playlist-card {
  overflow: hidden;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow: 0 16px 42px rgba(15, 23, 42, 0.06);
}

.cover-wrap {
  position: relative;
  height: 132px;
  overflow: hidden;
}

.cover-wrap img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.play-count {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 3px 9px;
  border-radius: 999px;
  color: #fff;
  font-size: 12px;
  background: rgba(15, 23, 42, 0.58);
}

.playlist-info {
  padding: 12px;
}

.playlist-info h3 {
  margin: 0 0 5px;
  font-size: 15px;
  color: #111827;
}

.playlist-info p {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}

.song-panel {
  overflow: hidden;
  border-radius: 22px;
  box-shadow: 0 16px 42px rgba(15, 23, 42, 0.06);
}

.song-panel :deep(.van-cell) {
  background: rgba(255, 255, 255, 0.9);
}

.song-panel :deep(.van-cell__title) {
  font-weight: 700;
}

.song-index {
  width: 30px;
  height: 30px;
  margin-right: 8px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-weight: 900;
  color: #2563eb;
  background: #eff6ff;
}

.card-hover {
  transition: all 0.25s ease;
}

.card-hover:active {
  transform: scale(0.97);
}

:global(html.dark) .home-page {
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.2), transparent 30%),
    radial-gradient(circle at top right, rgba(168, 85, 247, 0.18), transparent 30%),
    #0f172a;
}

:global(html.dark) .section-title h2,
:global(html.dark) .rank-card h3,
:global(html.dark) .playlist-info h3 {
  color: #f8fafc;
}

:global(html.dark) .rank-card,
:global(html.dark) .playlist-card,
:global(html.dark) .song-panel :deep(.van-cell) {
  background: rgba(30, 41, 59, 0.86);
}

:global(html.dark) .rank-card p,
:global(html.dark) .playlist-info p {
  color: #94a3b8;
}
</style>