import { defineStore } from 'pinia'
import api from '../api/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
  },

  actions: {
    async login(username, password) {
      try {
        const response = await api.post('/auth-login', { username, password })
        const { token, user } = response.data.data

        this.token = token
        this.user = user

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))

        return { success: true }
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.error || 'Error al iniciar sesión'
        }
      }
    },

    async register(userData) {
      try {
        const response = await api.post('/auth-register', userData)
        const { token, user } = response.data.data

        this.token = token
        this.user = user

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))

        return { success: true }
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.error || 'Error al registrarse'
        }
      }
    },

    async checkAuth() {
      if (!this.token) return false

      try {
        const response = await api.get('/auth-me')
        this.user = response.data.data
        localStorage.setItem('user', JSON.stringify(this.user))
        return true
      } catch (error) {
        this.logout()
        return false
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})
