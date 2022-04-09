import { createRouter, createWebHistory } from 'vue-router'

import login from '../views/login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/dashboard.vue'),
      props: true
    },
    {
      path: "/:catchAll(.*)",
      name: '404',
      component: () => import(/* webpackChunkName: "404" */ '../views/login.vue'),
      props: true,
      meta: {
        title: '404 Not Found — Trezește Eroul Din Tine',
        metaTags: [
        ]
      }
    }
  ],
  scrollBehavior(to, from){
    if (to.hash){
      if (window.innerWidth >= 1024) var theOffset = 0
      else theOffset = 1
      if (to.path == from.path && from.name != undefined) return { el: to.hash, top: 1 }
      else return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ el: to.hash, top: theOffset })
        }, 2000)
      })
    } else return { top: 0 }
  }
})

export default router
