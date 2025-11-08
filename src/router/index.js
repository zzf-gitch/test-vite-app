import {
  createRouter,
  createWebHistory
} from 'vue-router'

const audioPlayer = () => import('../views/audioPlayer/index.vue')

const router = createRouter({
  history: createWebHistory(
    import.meta.env.BASE_URL),
  routes: [{
      path: '/',
      name: 'home',
      component: () => import('../views/home/index.vue'),
    },
    {
      path: '/user',
      name: 'user',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/user/index.vue'),
    },
    {
      path: '/audioPlayer',
      name: 'audioPlayer',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: audioPlayer,
    },
  ],
})

export default router