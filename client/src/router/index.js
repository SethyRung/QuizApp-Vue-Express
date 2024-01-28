import { createRouter, createWebHistory } from 'vue-router'
import useAuthStore from '@/stores/auth'
import axios from 'axios'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'home',
      path: '/',
      component: () => import('@/views/home.vue')
    },
    {
      name: 'quiz',
      path: '/quiz',
      component: () => import('@/views/quiz.vue'),
      meta: {
        requiresAuth: true,
        roles: [5150, 2001]
      }
    },
    {
      name: 'account',
      path: '/account',
      component: () => import('@/views/account-center.vue'),
      meta: {
        requiresAuth: true,
        roles: [5150, 2001]
      }
    },
    {
      name: 'personal-details',
      path: '/account/personal-details',
      component: () => import('@/views/personal-details.vue'),
      meta: {
        requiresAuth: true,
        roles: [5150, 2001]
      }
    },
    {
      name: 'password-security',
      path: '/account/password-security',
      component: () => import('@/views/password-security.vue'),
      meta: {
        requiresAuth: true,
        roles: [5150, 2001]
      }
    },
    {
      name: 'auth',
      path: '/auth',
      component: () => import('@/views/authentication.vue')
    },
    {
      path: '/admin',
      redirect: { name: 'dashboard' },
      meta: {
        requiresAuth: true,
        roles: [5150]
      }
    },
    {
      name: 'admin_dashboard',
      path: '/admin/dashboard',
      component: () => import('@/views/admin/dashboard.vue'),
      meta: {
        requiresAuth: true,
        roles: [5150]
      }
    },
    {
      name: 'admin_user',
      path: '/admin/user',
      component: () => import('@/views/admin/user.vue'),
      meta: {
        requiresAuth: true,
        roles: [5150]
      }
    },
    {
      name: 'admin_category',
      path: '/admin/category',
      component: () => import('@/views/admin/category.vue'),
      meta: {
        requiresAuth: true,
        roles: [5150]
      }
    },
    {
      name: 'admin_quiz',
      path: '/admin/quiz',
      component: () => import('@/views/admin/quiz.vue'),
      meta: {
        requiresAuth: true,
        roles: [5150]
      }
    },
    {
      path: '/:catchAll(.*)*',
      redirect: { name: 'home' }
    }
  ]
  // linkExactActiveClass: 'text-green-600'
})

router.beforeEach(async (to, from, next) => {
  if (!to.meta.requiresAuth) {
    next()
    return
  }

  const store = useAuthStore()
  if (store.userLoggedIn) {
    for (let i = 0; i < store.roles.length; i++) {
      if (to.meta.roles.includes(store.roles[i])) {
        next()
        break
      } else next({ name: 'home' })
    }
  } else {
    try {
      const res = await axios.post('/auth/currentUser')
      if (res.status === 200) {
        for (let i = 0; i < store.roles.length; i++) {
          if (to.meta.roles.includes(store.roles[i])) {
            next()
            break
          } else next({ name: 'home' })
        }
      } else next({ name: 'home' })
    } catch (err) {
      next({ name: 'auth' })
    }
  }
})

export default router
