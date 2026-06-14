import { createRouter, createWebHashHistory } from 'vue-router'

import Home from '../views/Home.vue'
import SongList from '../views/SongList.vue'
import Play from '../views/Play.vue'
import Mine from '../views/Mine.vue'
import NotFound from '../views/NotFound.vue'

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
  history: createWebHashHistory(),
  routes
})

export default router