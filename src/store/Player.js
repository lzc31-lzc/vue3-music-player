import { defineStore } from 'pinia'
import { getSongList } from '../api/music'
import { parseLyric } from '../utils/lyric'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    songList: [],

    currentIndex: null,
    isPlaying: false,

    currentTime: 0,
    duration: 0,
    progress: 0,

    lyricList: [],
    currentLyricIndex: 0,

    audio: null,

    playMode: 'order',

    historyList: [],
    favoriteList: []
  }),

  getters: {
    currentSong(state) {
      if (state.currentIndex === null) return null
      return state.songList[state.currentIndex]
    }
  },

  actions: {
    async loadSongList() {
      const res = await getSongList()

      if (res.code === 200) {
        this.songList = res.data
      }
    },

    setAudio(audio) {
      this.audio = audio
    },

    setCurrentSong(song) {
      const index = this.songList.findIndex(item => item.id === song.id)

      if (index !== -1) {
        this.currentIndex = index

        const currentSong = this.songList[index]

        this.lyricList = parseLyric(currentSong.lyric || '')
        this.currentLyricIndex = 0

        this.addHistory(currentSong)
        this.resetProgress()
      }
    },

    play() {
      if (this.currentSong) {
        this.isPlaying = true
      }
    },

    pause() {
      this.isPlaying = false
    },

    togglePlay() {
      if (!this.currentSong && this.songList.length > 0) {
        this.currentIndex = 0
        this.lyricList = parseLyric(this.currentSong.lyric || '')
        this.addHistory(this.currentSong)
      }

      this.isPlaying = !this.isPlaying
    },

    prevSong() {
      if (!this.songList.length) return

      if (this.currentIndex === null) {
        this.currentIndex = 0
      } else if (this.currentIndex <= 0) {
        this.currentIndex = this.songList.length - 1
      } else {
        this.currentIndex--
      }

      this.lyricList = parseLyric(this.currentSong.lyric || '')
      this.currentLyricIndex = 0

      this.addHistory(this.currentSong)
      this.isPlaying = true
      this.resetProgress()
    },

    nextSong() {
      if (!this.songList.length) return

      if (this.playMode === 'random') {
        this.currentIndex = Math.floor(Math.random() * this.songList.length)
      } else if (this.currentIndex === null) {
        this.currentIndex = 0
      } else if (this.currentIndex >= this.songList.length - 1) {
        this.currentIndex = 0
      } else {
        this.currentIndex++
      }

      this.lyricList = parseLyric(this.currentSong.lyric || '')
      this.currentLyricIndex = 0

      this.addHistory(this.currentSong)
      this.isPlaying = true
      this.resetProgress()
    },

    togglePlayMode() {
      const modes = ['order', 'single', 'random']
      const index = modes.indexOf(this.playMode)
      this.playMode = modes[(index + 1) % modes.length]
    },

    updateCurrentLyric() {
      if (!this.lyricList.length) return

      for (let i = this.lyricList.length - 1; i >= 0; i--) {
        if (this.currentTime >= this.lyricList[i].time) {
          this.currentLyricIndex = i
          break
        }
      }
    },

    addHistory(song) {
      if (!song) return

      this.historyList = this.historyList.filter(item => item.id !== song.id)
      this.historyList.unshift(song)

      if (this.historyList.length > 20) {
        this.historyList.pop()
      }
    },

    toggleFavorite(song) {
      if (!song) return

      const index = this.favoriteList.findIndex(item => item.id === song.id)

      if (index === -1) {
        this.favoriteList.unshift(song)
      } else {
        this.favoriteList.splice(index, 1)
      }
    },

    clearHistory() {
      this.historyList = []
    },

    clearFavorite() {
      this.favoriteList = []
    },

    isFavorite(song) {
      if (!song) return false
      return this.favoriteList.some(item => item.id === song.id)
    },

    resetProgress() {
      this.currentTime = 0
      this.duration = 0
      this.progress = 0
    },

    changeProgress(value) {
      this.progress = value

      if (this.audio && this.duration > 0) {
        const targetTime = (value / 100) * this.duration
        this.audio.currentTime = targetTime
        this.currentTime = targetTime
      }
    }
  },

  persist: {
    pick: [
      'currentIndex',
      'playMode',
      'historyList',
      'favoriteList'
    ]
  }
})