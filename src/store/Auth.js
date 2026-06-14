import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLogin: false,
    userInfo: null
  }),

  actions: {
    login(username, password) {
      if (!username || !password) {
        return false
      }

      this.isLogin = true
      this.userInfo = {
        username,
        avatar: 'https://picsum.photos/200/200?random=99',
        desc: '热爱音乐，热爱前端'
      }

      return true
    },

    register(username, password) {
      if (!username || !password) {
        return false
      }

      this.isLogin = true
      this.userInfo = {
        username,
        avatar: 'https://picsum.photos/200/200?random=88',
        desc: '欢迎加入 Vue3 Music Player'
      }

      return true
    },

    logout() {
      this.isLogin = false
      this.userInfo = null
    }
  },

  persist: true
})