<template>
  <div class="mine">
    <van-nav-bar title="个人中心" />

    <div class="user-card">
      <template v-if="auth.isLogin">
        <img class="avatar" :src="auth.userInfo.avatar" />
        <div class="username">{{ auth.userInfo.username }}</div>
        <div class="desc">{{ auth.userInfo.desc }}</div>

        <van-button
          class="logout-btn"
          size="small"
          round
          @click="logout"
        >
          退出登录
        </van-button>
      </template>

      <template v-else>
        <div class="login-title">欢迎来到音乐世界</div>
        <div class="desc">登录后可同步收藏和播放历史</div>

        <div class="login-actions">
          <van-button round color="linear-gradient(135deg,#8b5cf6,#ec4899)" @click="openLogin">
            登录
          </van-button>
          <van-button round    color="linear-gradient(135deg,#f59e0b,#fbbf24)" @click="openRegister">
            注册
          </van-button>
        </div>
      </template>
    </div>

    <div class="stats">
      <div>
        <strong>{{ player.favoriteList.length }}</strong>
        <span>收藏</span>
      </div>
      <div>
        <strong>{{ player.historyList.length }}</strong>
        <span>历史</span>
      </div>
      <div>
        <strong>{{ player.songList.length }}</strong>
        <span>歌曲</span>
      </div>
    </div>

    <div class="section-title">设置</div>

    <van-cell-group inset>
      <van-cell title="深色模式" icon="setting-o">
        <template #right-icon>
          <van-switch
            v-model="theme.isDark"
            size="22px"
            @change="theme.initTheme"
          />
        </template>
      </van-cell>
    </van-cell-group>

    <div class="section-header">
      <span>我的收藏</span>
      <van-button
        v-if="player.favoriteList.length"
        size="small"
        type="danger"
        plain
        round
        @click="clearFavorite"
      >
        清空
      </van-button>
    </div>

    <van-cell-group inset>
      <template v-if="player.favoriteList.length">
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

      <van-empty v-else description="还没有收藏歌曲" />
    </van-cell-group>

    <div class="section-header">
      <span>播放历史</span>
      <van-button
        v-if="player.historyList.length"
        size="small"
        type="danger"
        plain
        round
        @click="clearHistory"
      >
        清空
      </van-button>
    </div>

    <van-cell-group inset>
      <template v-if="player.historyList.length">
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

      <van-empty v-else description="暂无播放历史" />
    </van-cell-group>

    <van-popup
      v-model:show="showAuth"
      round
      position="bottom"
      :style="{ padding: '24px 20px' }"
    >
      <div class="auth-box">
        <div class="auth-title">
          {{ authType === 'login' ? '用户登录' : '用户注册' }}
        </div>

        <van-field
          v-model="form.username"
          label="用户名"
          placeholder="请输入用户名"
          left-icon="user-o"
        />

        <van-field
          v-model="form.password"
          label="密码"
          type="password"
          placeholder="请输入密码"
          left-icon="lock"
        />

        <van-button
          block
          round
          color="linear-gradient(135deg,#8b5cf6,#ec4899)"
          class="auth-submit"
          @click="submitAuth"
        >
          {{ authType === 'login' ? '登录' : '注册' }}
        </van-button>

        <div class="auth-switch" @click="toggleAuthType">
          {{ authType === 'login' ? '没有账号？去注册' : '已有账号？去登录' }}
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirmDialog, showToast } from 'vant'

import { usePlayerStore } from '../store/Player'
import { useThemeStore } from '../store/Theme'
import { useAuthStore } from '../store/Auth'

const router = useRouter()

const player = usePlayerStore()
const theme = useThemeStore()
const auth = useAuthStore()

const showAuth = ref(false)
const authType = ref('login')

const form = reactive({
  username: '',
  password: ''
})

const resetForm = () => {
  form.username = ''
  form.password = ''
}

const openLogin = () => {
  authType.value = 'login'
  resetForm()
  showAuth.value = true
}

const openRegister = () => {
  authType.value = 'register'
  resetForm()
  showAuth.value = true
}

const toggleAuthType = () => {
  authType.value = authType.value === 'login' ? 'register' : 'login'
  resetForm()
}

const submitAuth = () => {
  if (!form.username || !form.password) {
    showToast('请输入用户名和密码')
    return
  }

  const success =
    authType.value === 'login'
      ? auth.login(form.username, form.password)
      : auth.register(form.username, form.password)

  if (success) {
    showToast(authType.value === 'login' ? '登录成功' : '注册成功')
    showAuth.value = false
  }
}

const logout = async () => {
  try {
    await showConfirmDialog({
      title: '退出登录',
      message: '确定要退出当前账号吗？'
    })

    auth.logout()
    showToast('已退出登录')
  } catch {}
}

const playSong = (song) => {
  player.setCurrentSong(song)
  player.pause()
  router.push('/play')
}

const clearFavorite = async () => {
  try {
    await showConfirmDialog({
      title: '提示',
      message: '确定清空所有收藏歌曲吗？'
    })

    player.clearFavorite()
    showToast('收藏已清空')
  } catch {}
}

const clearHistory = async () => {
  try {
    await showConfirmDialog({
      title: '提示',
      message: '确定清空播放历史吗？'
    })

    player.clearHistory()
    showToast('历史已清空')
  } catch {}
}
</script>

<style scoped>
.mine {
  min-height: 100vh;
  padding-bottom: 130px;
  background:
    radial-gradient(circle at 10% 0%, rgba(139, 92, 246, 0.18), transparent 28%),
    radial-gradient(circle at 90% 0%, rgba(236, 72, 153, 0.16), transparent 28%),
    #f7f8fa;
}

.user-card {
  margin: 18px 16px;
  padding: 30px 20px;
  border-radius: 28px;
  text-align: center;
  color: #fff;
  background: linear-gradient(135deg, #111827,  #1f2937,  #f59e0b);
  box-shadow: 0 16px 38px rgba(245, 158, 11, 0.25);
}

.avatar {
  width: 86px;
  height: 86px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.7);
}

.username {
  margin-top: 14px;
  font-size: 24px;
  font-weight: 900;
}

.login-title {
  font-size: 25px;
  font-weight: 900;
}

.desc {
  margin-top: 8px;
  font-size: 13px;
  opacity: 0.82;
}

.login-actions {
  margin-top: 22px;
  display: flex;
  justify-content: center;
  gap: 14px;
}

.logout-btn {
  margin-top: 18px;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin: 0 16px 20px;
  padding: 18px 0;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
}

.stats div {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stats strong {
  font-size: 22px;
  color: #111827;
}

.stats span {
  margin-top: 5px;
  font-size: 12px;
  color: #6b7280;
}

.section-title {
  padding: 18px 18px 10px;
  font-size: 19px;
  font-weight: 900;
  color: #111827;
}

.section-header {
  padding: 20px 18px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header span {
  font-size: 19px;
  font-weight: 900;
  color: #111827;
}

.auth-box {
  padding-bottom: 10px;
}

.auth-title {
  margin-bottom: 20px;
  text-align: center;
  font-size: 22px;
  font-weight: 900;
  color: #111827;
}

.auth-submit {
  margin-top: 22px;
}

.auth-switch {
  margin-top: 16px;
  text-align: center;
  font-size: 13px;
  color: #8b5cf6;
  font-weight: 700;
}
.logout-btn {
  margin-top: 18px;
  background: #ffffff !important;
  color: #111827 !important;
  border: none !important;
  font-weight: 700;
  padding: 0 18px;
}
</style>