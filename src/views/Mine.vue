<template>
  <div class="page mine-page">
    <section class="mine-header">
      <div class="header-bg"></div>

      <div class="user-card">
        <img class="avatar" :src="user.avatar" />

        <div class="user-info">
          <h2>{{ user.nickname }}</h2>
          <p>{{ user.desc }}</p>
        </div>

        <van-button round size="small" class="edit-btn" @click="editUser">
          编辑
        </van-button>
      </div>

      <div class="stats-card">
        <div class="stat-item">
          <strong>{{ user.favoriteCount }}</strong>
          <span>收藏</span>
        </div>
        <div class="stat-item">
          <strong>{{ user.historyCount }}</strong>
          <span>播放</span>
        </div>
        <div class="stat-item">
          <strong>{{ user.playlistCount }}</strong>
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

      <van-cell
        title="我的收藏"
        label="喜欢的歌曲都在这里"
        icon="like-o"
        is-link
        @click="goFavorite"
      />

      <van-cell
        title="播放历史"
        label="查看最近播放记录"
        icon="clock-o"
        is-link
        @click="goHistory"
      />

      <van-cell
        title="我的歌单"
        label="管理创建和收藏的歌单"
        icon="music-o"
        is-link
      />
    </section>

    <section class="mine-panel">
      <div class="panel-title">系统设置</div>

      <van-cell title="深色模式" label="切换应用主题" icon="bulb-o">
        <template #right-icon>
          <van-switch v-model="darkMode" size="22px" />
        </template>
      </van-cell>

      <van-cell
        title="清除缓存"
        label="清理本地播放缓存"
        icon="delete-o"
        is-link
        @click="clearCache"
      />

      <van-cell
        title="关于项目"
        label="Vue3 + Vite 音乐播放器"
        icon="info-o"
        is-link
        @click="showAbout"
      />
    </section>

    <section class="mine-panel danger-panel">
      <van-cell
        title="退出登录"
        icon="close"
        is-link
        @click="logout"
      />
    </section>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { showToast, showConfirmDialog } from 'vant'

const user = ref({
  nickname: '白鹿',
  desc: '热爱音乐，也热爱前端开发',
  avatar: 'https://picsum.photos/200/200?random=88',
  favoriteCount: 36,
  historyCount: 128,
  playlistCount: 12
})

const darkMode = ref(false)

const quickList = ref([
  { title: '收藏', icon: 'like-o', type: 'favorite' },
  { title: '历史', icon: 'clock-o', type: 'history' },
  { title: '下载', icon: 'down', type: 'download' },
  { title: '歌单', icon: 'music-o', type: 'playlist' }
])

onMounted(() => {
  const localUser = localStorage.getItem('music_user')
  const localTheme = localStorage.getItem('music_theme')

  if (localUser) {
    try {
      user.value = {
        ...user.value,
        ...JSON.parse(localUser)
      }
    } catch (error) {
      console.log(error)
    }
  }

  if (localTheme === 'dark') {
    darkMode.value = true
    document.documentElement.classList.add('dark')
  }
})

watch(darkMode, (value) => {
  if (value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('music_theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('music_theme', 'light')
  }
})

const editUser = () => {
  showToast('编辑资料功能开发中')
}

const handleQuick = (item) => {
  showToast(item.title)
}

const goFavorite = () => {
  showToast('我的收藏')
}

const goHistory = () => {
  showToast('播放历史')
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

    localStorage.removeItem('music_user')
    showToast('已退出登录')
  } catch (error) {
    console.log('取消退出')
  }
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
  -webkit-backdrop-filter: blur(18px);
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

.edit-btn {
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
  -webkit-backdrop-filter: blur(18px);
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
  transition: all 0.25s ease;
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
  -webkit-backdrop-filter: blur(18px);
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