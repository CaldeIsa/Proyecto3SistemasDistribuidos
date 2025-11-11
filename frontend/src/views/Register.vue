<template>
  <div class="container">
    <div class="card" style="max-width: 500px; margin: 100px auto;">
      <h1 style="text-align: center; color: #667eea; margin-bottom: 32px;">Registrarse</h1>
      
      <div v-if="error" class="error">{{ error }}</div>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>Nombre Completo</label>
          <input 
            v-model="form.nombre" 
            type="text" 
            class="form-control" 
            required
          />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input 
            v-model="form.email" 
            type="email" 
            class="form-control" 
            required
          />
        </div>

        <div class="form-group">
          <label>Usuario</label>
          <input 
            v-model="form.username" 
            type="text" 
            class="form-control" 
            required
          />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input 
            v-model="form.password" 
            type="password" 
            class="form-control" 
            required
          />
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%;" :disabled="loading">
          {{ loading ? 'Registrando...' : 'Registrarse' }}
        </button>
      </form>

      <p style="text-align: center; margin-top: 24px;">
        ¿Ya tienes cuenta? 
        <router-link to="/login" style="color: #667eea; font-weight: 600;">Inicia sesión aquí</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  nombre: '',
  email: '',
  username: '',
  password: ''
})

const error = ref('')
const loading = ref(false)

const handleRegister = async () => {
  error.value = ''
  loading.value = true

  const result = await authStore.register(form.value)

  loading.value = false

  if (result.success) {
    router.push('/')
  } else {
    error.value = result.error
  }
}
</script>
