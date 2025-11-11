<template>
  <div id="app">
    <Navbar v-if="authStore.isAuthenticated" />
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import Navbar from './components/Navbar.vue'

const authStore = useAuthStore()

onMounted(async () => {
  if (authStore.token) {
    await authStore.checkAuth()
  }
})
</script>
