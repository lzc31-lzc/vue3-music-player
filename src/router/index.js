import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('../views/Home.vue')
const SongList = () => import('../views/SongList.vue')
const Play = () => import('../views/Play.vue')
const Mine = () => import('../views/Mine.vue')
const NotFound = () => import('../views/NotFound.vue')

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/songlist',
    name: 'SongList',
    component: SongList
  },
  {
    path: '/play',
    name: 'Play',
    component: Play
  },
  {
    path: '/mine',
    name: 'Mine',
    component: Mine
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router