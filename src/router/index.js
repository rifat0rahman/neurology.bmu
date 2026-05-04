import { createRouter, createWebHistory } from 'vue-router'
import { jwtDecode } from "jwt-decode"


import entry from '../views/entry.vue'
import dashboard from '../views/dashboard.vue'
import records from '../views/records.vue'
import admin from '../views/admin.vue'
import settings from '../views/settings.vue'

import login from '../views/auth/login.vue'
import registration from '@/views/auth/registration.vue'
import Notfound from '@/components/notfound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: dashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/entry',
      name: 'entry',
      component: entry,
      meta: { requiresAuth: true }
    },
    {
      path: '/entry/:id',
      name: 'entryid',
      component: entry,
      meta: { requiresAuth: true }
    },
    {
      path: '/records',
      name: 'records',
      component: records,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'admin',
      component: admin,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: settings,
      meta: { requiresAuth: true }
    },

    {
      path: '/login',
      name: 'login',
      component: login,
      meta: { hideNavbar: true, guestOnly: true }
    },
    {
      path: '/registration',
      name: 'registration',
      component: registration,
      meta: { hideNavbar: true, guestOnly: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notfound',
      component: Notfound,
      meta: { hideNavbar: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token")

  let user = null

  if (token) {
    try {
      user = jwtDecode(token)
    } catch {
      localStorage.removeItem("token")
      return next("/login")
    }
  }

  if (to.matched.some(r => r.meta.requiresAuth) && !token) {
    return next("/login")
  }

  if (to.matched.some(r => r.meta.guestOnly) && token) {
    return next("/")
  }

  if (to.matched.some(r => r.meta.requiresAdmin) && user?.role !== "admin") {
    return next("/")
  }

  next()
})

export default router
