<template>
  <nav class="navbar">
    <div class="navbar-content">
      <router-link to="/" class="navbar-brand">🎨 Catálogo de Pinturas</router-link>
      
      <div class="navbar-menu">
        <router-link to="/" class="navbar-link" active-class="active">Inicio</router-link>
        <router-link to="/pinturas" class="navbar-link" active-class="active">Pinturas</router-link>
        <router-link to="/artistas" class="navbar-link" active-class="active">Artistas</router-link>
        <router-link to="/museos" class="navbar-link" active-class="active">Museos</router-link>
        <router-link v-if="authStore.isAdmin" to="/admin" class="navbar-link" active-class="active">Admin</router-link>
        
        <div class="navbar-user">
          <span>{{ authStore.user?.nombre }}</span>
          <button @click="handleLogout" class="btn btn-secondary" style="margin-left: 12px;">Salir</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
