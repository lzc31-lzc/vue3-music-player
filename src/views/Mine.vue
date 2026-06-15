<template>
  <div class="page mine-page">
    <section class="mine-header">
      <div class="header-bg"></div>

      <div class="user-card">
        <img class="avatar" :src="isLogin ? user.avatar : defaultAvatar" />

        <div class="user-info">
          <h2>{{ isLogin ? user.nickname : '未登录用户' }}</h2>
          <p>{{ isLogin ? user.desc : '登录后体验完整音乐功能' }}</p>
        </div>

        <van-button
          v-if="!isLogin"
          round
          size="small"
          class="login-btn"
          @click="showLogin = true"
        >
          登录
        </van-button>

        <van-button
          v-else
          round
          size="small"
          class="edit-btn"
          @click="editUser"
        >
          编辑
        </van-button>
      </div>

      <div class="stats-card">
        <div class="stat-item">
          <strong>{{ isLogin ? player.favoriteList.length : 0 }}</strong>
          <span>收藏</span>
        </div>
        <div class="stat-item">
          <strong>{{ isLogin ? player.historyList.length : 0 }}</strong>
          <span>播放</span>
        </div>
        <div class="stat-item">
          <strong>{{ isLogin ? myPlaylist.length : 0 }}</strong>
          <span>歌单</span>
        </div>
      </div>
    </section>

    <section class="quick-grid">
      <div
        v-for="item in quickList"
        :key="item.title"
        class="quick-card"
        @click="handleQuick(item)"
      >
        <div class="quick-icon">
          <van-icon :name="item.icon" size="24" />
        </div>
        <span>{{ item.title }}</span>
      </div>
    </section>

    <section class="mine-panel">
      <div class="panel-title">我的音乐</div>

      <van-cell title="我的收藏" label="喜欢的歌曲都在这里" icon="like-o" is-link @click="openDetail('我的收藏')" />
      <van-cell title="播放历史" label="查看最近播放记录" icon="clock-o" is-link @click="openDetail('播放历史')" />
      <van-cell title="我的歌单" label="管理创建和收藏的歌单" icon="music-o" is-link @click="openDetail('我的歌单')" />
    </section>

    <section class="mine-panel">
      <div class="panel-title">系统设置</div>

      <van-cell title="深色模式" label="切换应用主题" icon="bulb-o">
        <template #right-icon>
          <van-switch v-model="darkMode" size="22px" />
        </template>
      </van-cell>

      <van-cell title="清除缓存" label="清理本地播放缓存" icon="delete-o" is-link @click="clearCache" />
      <van-cell title="关于项目" label="Vue3 + Vite 音乐播放器" icon="info-o" is-link @click="showAbout" />
    </section>

    <section v-if="isLogin" class="mine-panel danger-panel">
      <van-cell title="退出登录" icon="close" is-link @click="logout" />
    </section>

    <van-popup v-model:show="showLogin" round position="bottom">
      <div class="auth-box">
        <h2>{{ authMode === 'login' ? '欢迎登录' : '创建账号' }}</h2>
        <p>{{ authMode === 'login' ? '登录后同步你的音乐偏好' : '注册一个新的音乐账号' }}</p>

        <van-field v-model="form.username" label="账号" placeholder="请输入账号" />
        <van-field v-model="form.password" label="密码" type="password" placeholder="请输入密码" />

        <van-field
          v-if="authMode === 'register'"
          v-model="form.nickname"
          label="昵称"
          placeholder="请输入昵称"
        />

        <van-button block round class="auth-submit" @click="submitAuth">
          {{ authMode === 'login' ? '登录' : '注册' }}
        </van-button>

        <div class="auth-switch">
          <span v-if="authMode === 'login'">
            没有账号？
            <b @click="authMode = 'register'">去注册</b>
          </span>

          <span v-else>
            已有账号？
            <b @click="authMode = 'login'">去登录</b>
          </span>
        </div>
      </div>
    </van-popup>

    <van-popup v-model:show="showDetail" round position="bottom">
      <div class="detail-box">
        <h2>{{ detailTitle }}</h2>

        <template v-if="detailTitle === '我的收藏'">
          <van-empty v-if="player.favoriteList.length === 0" description="暂无收藏歌曲" />

          <van-cell
            v-for="song in player.favoriteList"
            :key="song.id"
            :title="song.name"
            :label="song.singer"
            icon="like-o"
            is-link
            @click="playSong(song)"
          />
        </template>

        <template v-if="detailTitle === '播放历史'">
          <van-empty v-if="player.historyList.length === 0" description="暂无播放历史" />

          <van-cell
            v-for="song in player.historyList"
            :key="song.id"
            :title="song.name"
            :label="song.singer"
            icon="clock-o"
            is-link
            @click="playSong(song)"
          />
        </template>

        <template v-if="detailTitle === '我的歌单'">
          <div
            v-for="item in myPlaylist"
            :key="item.id"
            class="playlist-item"
          >
            <img :src="item.cover" />
            <div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.count }} 首歌曲</p>
            </div>
          </div>
        </template>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import { usePlayerStore } from '../store/Player'

const router = useRouter()
const player = usePlayerStore()

const defaultAvatar = 'https://picsum.photos/200/200?random=66'

const user = ref({
  nickname: '白鹿',
  desc: '热爱音乐，也热爱前端开发',
  avatar: 'https://picsum.photos/200/200?random=88',
  favoriteCount: 36,
  historyCount: 128,
  playlistCount: 12
})

const isLogin = ref(false)
const showLogin = ref(false)
const showDetail = ref(false)
const detailTitle = ref('')
const authMode = ref('login')
const darkMode = ref(false)

const form = ref({
  username: '',
  password: '',
  nickname: ''
})

const quickList = ref([
  { title: '收藏', icon: 'like-o' },
  { title: '历史', icon: 'clock-o' },
  { title: '下载', icon: 'down' },
  { title: '歌单', icon: 'music-o' }
])

const myPlaylist = ref([
  {
    id: 1,
    title: '我喜欢的音乐',
    count: player.favoriteList.length,
    cover: 'https://picsum.photos/200/200?random=21'
  },
  {
    id: 2,
    title: '最近常听',
    count: player.historyList.length,
    cover: 'https://picsum.photos/200/200?random=22'
  }
])

onMounted(() => {
  const loginUser = localStorage.getItem('music_login_user')
  const localTheme = localStorage.getItem('music_theme')

  if (loginUser) {
    user.value = {
      ...user.value,
      ...JSON.parse(loginUser)
    }
    isLogin.value = true
  }

  if (localTheme === 'dark') {
    darkMode.value = true
    document.documentElement.classList.add('dark')
  }

  if (player.songList.length === 0) {
    player.loadSongList()
  }
})

watch(darkMode, (value) => {
  document.documentElement.classList.toggle('dark', value)
  localStorage.setItem('music_theme', value ? 'dark' : 'light')
})

const submitAuth = () => {
  if (!form.value.username || !form.value.password) {
    showToast('请输入账号和密码')
    return
  }

  if (authMode.value === 'register') {
    if (!form.value.nickname) {
      showToast('请输入昵称')
      return
    }

    const newUser = {
      username: form.value.username,
      password: form.value.password,
      nickname: form.value.nickname,
      desc: '这个人很喜欢音乐',
      avatar: 'https://picsum.photos/200/200?random=99',
      favoriteCount: 0,
      historyCount: 0,
      playlistCount: 0
    }

    localStorage.setItem('music_account', JSON.stringify(newUser))
    localStorage.setItem('music_login_user', JSON.stringify(newUser))

    user.value = {
      ...user.value,
      ...newUser
    }

    isLogin.value = true
    showLogin.value = false
    showToast('注册成功')
    return
  }

  const account = JSON.parse(localStorage.getItem('music_account') || 'null')

  if (!account) {
    showToast('账号不存在，请先注册')
    return
  }

  if (account.username !== form.value.username || account.password !== form.value.password) {
    showToast('账号或密码错误')
    return
  }

  localStorage.setItem('music_login_user', JSON.stringify(account))

  user.value = {
    ...user.value,
    ...account
  }

  isLogin.value = true
  showLogin.value = false
  showToast('登录成功')
}

const openDetail = (title) => {
  if (!isLogin.value) {
    showToast('请先登录')
    showLogin.value = true
    return
  }

  detailTitle.value = title
  showDetail.value = true
}

const handleQuick = (item) => {
  if (item.title === '收藏') openDetail('我的收藏')
  else if (item.title === '历史') openDetail('播放历史')
  else if (item.title === '歌单') openDetail('我的歌单')
  else showToast('下载功能开发中')
}

const playSong = (song) => {
  player.setCurrentSong(song)
  player.pause()
  showDetail.value = false
  router.push('/play')
}

const editUser = () => {
  showToast('编辑资料功能开发中')
}

const clearCache = () => {
  localStorage.removeItem('music_play_history')
  showToast('缓存已清除')
}

const showAbout = () => {
  showToast('Vue3 音乐播放器项目')
}

const logout = async () => {
  try {
    await showConfirmDialog({
      title: '确认退出',
      message: '确定要退出当前账号吗？'
    })

    localStorage.removeItem('music_login_user')
    isLogin.value = false
    showToast('已退出登录')
  } catch (error) {}
}
</script>

<style scoped>
.mine-page {
  min-height: 100vh;
  padding: 0 14px 88px;
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.16), transparent 30%),
    radial-gradient(circle at top right, rgba(168, 85, 247, 0.14), transparent 30%),
    #f6f7fb;
}

.mine-header {
  position: relative;
  padding-top: 26px;
}

.header-bg {
  position: absolute;
  top: 0;
  left: -14px;
  right: -14px;
  height: 210px;
  border-radius: 0 0 34px 34px;
  background:
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.28), transparent 26%),
    linear-gradient(135deg, #111827 0%, #2563eb 52%, #22d3ee 100%);
}

.user-card {
  position: relative;
  z-index: 1;
  padding: 18px;
  border-radius: 26px;
  display: flex;
  align-items: center;
  color: #fff;
  background: rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.16);
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 24px;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.65);
}

.user-info {
  flex: 1;
  margin-left: 14px;
}

.user-info h2 {
  margin: 0 0 6px;
  font-size: 22px;
  font-weight: 900;
}

.user-info p {
  margin: 0;
  font-size: 13px;
  opacity: 0.86;
}

.edit-btn,
.login-btn,
.auth-submit {
  border: none;
  color: #fff;
  font-weight: 700;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
}

.stats-card {
  position: relative;
  z-index: 1;
  margin-top: 14px;
  padding: 16px 8px;
  border-radius: 24px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(18px);
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-item strong {
  font-size: 21px;
  color: #111827;
}

.stat-item span {
  font-size: 12px;
  color: #6b7280;
}

.quick-grid {
  margin-top: 22px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.quick-card {
  height: 86px;
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 9px;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
}

.quick-card:active {
  transform: scale(0.96);
}

.quick-icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  color: #2563eb;
  background: #eff6ff;
}

.quick-card span {
  font-size: 12px;
  color: #111827;
  font-weight: 700;
}

.mine-panel {
  margin-top: 18px;
  padding: 8px 0;
  border-radius: 24px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(18px);
  box-shadow: 0 16px 42px rgba(15, 23, 42, 0.06);
}

.panel-title {
  padding: 10px 16px 6px;
  font-size: 15px;
  font-weight: 900;
  color: #111827;
}

.mine-panel :deep(.van-cell) {
  background: transparent;
}

.mine-panel :deep(.van-cell__title) {
  font-weight: 700;
}

.mine-panel :deep(.van-cell__label) {
  font-size: 12px;
  color: #6b7280;
}

.danger-panel :deep(.van-cell__title) {
  color: #ef4444;
}

.auth-box {
  padding: 26px 20px 30px;
}

.auth-box h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 900;
}

.auth-box p {
  margin: 8px 0 20px;
  color: #6b7280;
  font-size: 13px;
}

.auth-submit {
  margin-top: 18px;
}

.auth-switch {
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
}

.auth-switch b {
  color: #2563eb;
}

.detail-box {
  max-height: 70vh;
  overflow-y: auto;
  padding: 24px 18px 32px;
}

.detail-box h2 {
  margin: 0 0 18px;
  font-size: 22px;
  font-weight: 900;
}

.playlist-item {
  display: flex;
  align-items: center;
  margin-bottom: 14px;
  padding: 12px;
  border-radius: 18px;
  background: #f7f8fa;
}

.playlist-item img {
  width: 58px;
  height: 58px;
  border-radius: 16px;
  object-fit: cover;
  margin-right: 12px;
}

.playlist-item h3 {
  margin: 0;
  font-size: 16px;
}

.playlist-item p {
  margin: 6px 0 0;
  font-size: 12px;
  color: #6b7280;
}

:global(html.dark) .mine-page {
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.2), transparent 30%),
    radial-gradient(circle at top right, rgba(168, 85, 247, 0.18), transparent 30%),
    #0f172a;
}

:global(html.dark) .stats-card,
:global(html.dark) .quick-card,
:global(html.dark) .mine-panel {
  background: rgba(30, 41, 59, 0.86);
}

:global(html.dark) .stat-item strong,
:global(html.dark) .quick-card span,
:global(html.dark) .panel-title {
  color: #f8fafc;
}

:global(html.dark) .stat-item span,
:global(html.dark) .mine-panel :deep(.van-cell__label) {
  color: #94a3b8;
}

:global(html.dark) .mine-panel :deep(.van-cell__title) {
  color: #f8fafc;
}
</style>