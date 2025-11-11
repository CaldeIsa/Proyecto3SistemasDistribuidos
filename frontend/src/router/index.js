import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/Register.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/pinturas',
      name: 'Pinturas',
      component: () => import('../views/Pinturas.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/pinturas/:id',
      name: 'PinturaDetalle',
      component: () => import('../views/PinturaDetalle.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/artistas',
      name: 'Artistas',
      component: () => import('../views/Artistas.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/artistas/:id',
      name: 'ArtistaDetalle',
      component: () => import('../views/ArtistaDetalle.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/museos',
      name: 'Museos',
      component: () => import('../views/Museos.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/museos/:id',
      name: 'MuseoDetalle',
      component: () => import('../views/MuseoDetalle.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('../views/Admin.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/')
  } else {
    next()
  }
})

export default router
