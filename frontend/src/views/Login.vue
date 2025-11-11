<template>
  <div class="container">
    <div class="card" style="max-width: 500px; margin: 100px auto;">
      <h1 style="text-align: center; color: #667eea; margin-bottom: 32px;">Iniciar Sesión</h1>
      
      <div v-if="error" class="error">{{ error }}</div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Usuario</label>
          <input 
            v-model="username" 
            type="text" 
            class="form-control" 
            placeholder="Ingresa tu usuario"
            required
          />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input 
            v-model="password" 
            type="password" 
            class="form-control" 
            placeholder="Ingresa tu contraseña"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%;" :disabled="loading">
          {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <p style="text-align: center; margin-top: 24px;">
        ¿No tienes cuenta? 
        <router-link to="/register" style="color: #667eea; font-weight: 600;">Regístrate aquí</router-link>
      </p>

      <div style="margin-top: 32px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
        <p style="font-weight: 600; margin-bottom: 8px;">Usuarios de prueba:</p>
        <p style="font-size: 14px; margin-bottom: 4px;">Admin: <code>admin / admin123</code></p>
        <p style="font-size: 14px;">Usuario: <code>usuario / usuario123</code></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  const result = await authStore.login(username.value, password.value)

  loading.value = false

  if (result.success) {
    router.push('/')
  } else {
    error.value = result.error
  }
}
</script>
