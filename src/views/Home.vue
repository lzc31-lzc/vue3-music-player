<template>
  <div class="home">
    <div class="hero">
      <div class="hero-top">
        <div>
          <div class="hello">Hi，欢迎回来</div>
          <div class="subtitle">发现今天适合你的音乐</div>
        </div>

        <van-icon name="bell" size="24" />
      </div>

      <van-search
        v-model="keyword"
        placeholder="搜索歌曲 / 歌手"
        shape="round"
        background="transparent"
        @search="goSearch"
      />

      <div class="daily-card">
        <div>
          <div class="daily-label">Daily Mix</div>
          <div class="daily-title">今日私人推荐</div>
          <div class="daily-desc">根据你的播放喜好生成</div>
        </div>

        <van-button round size="small" color="linear-gradient(135deg,#8b5cf6,#ec4899)" @click="goSongList">
          立即播放
        </van-button>
      </div>
    </div>

    <div class="section-header">
      <span>热门榜单</span>
      <small>更多</small>
    </div>

    <div class="rank-list">
      <div
        v-for="item in ranks"
        :key="item.id"
        class="rank-card"
        @click="goSongList"
      >
        <div class="rank-info">
          <div class="rank-title">{{ item.title }}</div>
          <div class="rank-desc">{{ item.desc }}</div>
        </div>
        <img :src="item.cover" />
      </div>
    </div>

    <div class="section-header">
      <span>推荐歌单</span>
      <small>换一批</small>
    </div>

    <div class="playlist">
      <div
        v-for="item in playList"
        :key="item.id"
        class="playlist-card"
        @click="goSongList"
      >
        <div class="cover-wrap">
          <img :src="item.cover" />
          <div class="play-count">
            <van-icon name="play-circle-o" />
            {{ item.count }}
          </div>
        </div>

        <div class="playlist-title">{{ item.title }}</div>
      </div>
    </div>

    <div class="section-header">
      <span>热门歌曲</span>
      <small>播放全部</small>
    </div>

    <van-cell-group inset class="hot-group">
      <van-cell
        v-for="(song, index) in hotSongs"
        :key="song.id"
        is-link
        @click="goPlay(song)"
      >
        <template #icon>
          <div class="song-index">{{ index + 1 }}</div>
        </template>

        <template #title>
          <div class="hot-title">{{ song.name }}</div>
        </template>

        <template #label>
          <div class="hot-singer">{{ song.singer }}</div>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '../store/Player'

const router = useRouter()
const player = usePlayerStore()

const keyword = ref('')

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

const playList = ref([
  {
    id: 1,
    title: '深夜情绪馆',
    cover: 'https://picsum.photos/300/300?random=1',
    count: '32万'
  },
  {
    id: 2,
    title: '学习专注BGM',
    cover: 'https://picsum.photos/300/300?random=2',
    count: '18万'
  },
  {
    id: 3,
    title: '华语流行精选',
    cover: 'https://picsum.photos/300/300?random=3',
    count: '56万'
  },
  {
    id: 4,
    title: '城市夜跑节奏',
    cover: 'https://picsum.photos/300/300?random=4',
    count: '12万'
  }
])

const hotSongs = ref([
  { id: 1, name: '晴天', singer: '周杰伦' },
  { id: 2, name: '夜曲', singer: '周杰伦' },
  { id: 3, name: '稻香', singer: '周杰伦' }
])

const goSearch = () => {
  router.push({
    path: '/songlist',
    query: {
      keyword: keyword.value
    }
  })
}

const goSongList = () => {
  router.push('/songlist')
}

const goPlay = async (song) => {
  if (player.songList.length === 0) {
    await player.loadSongList()
  }

  const target = player.songList.find(item => item.id === song.id)

  if (target) {
    player.setCurrentSong(target)
    player.pause()
    router.push('/play')
  }
}

onMounted(() => {
  if (player.songList.length === 0) {
    player.loadSongList()
  }
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  padding-bottom: 130px;
  background:
    radial-gradient(circle at 10% 0%, rgba(139, 92, 246, 0.18), transparent 28%),
    radial-gradient(circle at 90% 0%, rgba(236, 72, 153, 0.16), transparent 28%),
    #f7f8fa;
}

.hero {
  padding: 20px 16px 18px;
  border-radius: 0 0 30px 30px;
  background: linear-gradient(135deg,  #0f172a,  #2563eb, #38bdf8);
  color: #fff;
  box-shadow: 0 14px 35px rgba(79, 70, 229, 0.28);
}

.hero-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.hello {
  font-size: 24px;
  font-weight: 900;
}

.subtitle {
  margin-top: 6px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
}

.daily-card {
  margin-top: 14px;
  padding: 18px;
  border-radius: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background:
    linear-gradient(135deg, rgba(255,255,255,.24), rgba(255,255,255,.08));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,.18);
}

.daily-label {
  font-size: 12px;
  opacity: .75;
}

.daily-title {
  margin-top: 4px;
  font-size: 22px;
  font-weight: 900;
}

.daily-desc {
  margin-top: 6px;
  font-size: 12px;
  opacity: .72;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 16px 12px;
}

.section-header span {
  font-size: 20px;
  font-weight: 900;
  color: #111827;
}

.section-header small {
  color: #8b5cf6;
  font-weight: 700;
}

.rank-list {
  display: flex;
  gap: 12px;
  padding: 0 16px;
  overflow-x: auto;
}

.rank-list::-webkit-scrollbar {
  display: none;
}

.rank-card {
  min-width: 210px;
  padding: 14px;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
}

.rank-title {
  font-size: 17px;
  font-weight: 900;
  color: #111827;
}

.rank-desc {
  margin-top: 6px;
  font-size: 12px;
  color: #6b7280;
}

.rank-card img {
  width: 66px;
  height: 66px;
  border-radius: 18px;
  object-fit: cover;
}

.playlist {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  padding: 0 16px;
}

.playlist-card {
  border-radius: 22px;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
}

.cover-wrap {
  position: relative;
}

.cover-wrap img {
  width: 100%;
  height: 145px;
  object-fit: cover;
  display: block;
}

.play-count {
  position: absolute;
  right: 8px;
  top: 8px;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  color: #fff;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(8px);
}

.playlist-title {
  padding: 12px;
  font-size: 15px;
  font-weight: 800;
  color: #111827;
}

.hot-group {
  margin-bottom: 20px;
}

.song-index {
  width: 32px;
  height: 32px;
  margin-right: 8px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b5cf6;
  font-weight: 900;
  background: rgba(139, 92, 246, 0.1);
}

.hot-title {
  font-weight: 800;
}

.hot-singer {
  color: #6b7280;
}
</style>