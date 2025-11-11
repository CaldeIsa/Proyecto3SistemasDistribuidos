<template>
  <div class="container">
    <div v-if="loading" class="loading">Cargando...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else-if="pintura" class="card" style="max-width: 1000px; margin: 0 auto;">
      <img :src="pintura.imagenUrl" :alt="pintura.titulo" style="width: 100%; max-height: 600px; object-fit: contain; border-radius: 12px; margin-bottom: 32px;" />
      
      <h1 style="color: #667eea; margin-bottom: 24px;">{{ pintura.titulo }}</h1>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin-bottom: 32px;">
        <div>
          <h3 style="color: #667eea; margin-bottom: 8px;">Artista</h3>
          <router-link
            v-if="pintura.artista"
            :to="`/artistas/${pintura.artista.id}`"
            style="color: #333; text-decoration: none; font-size: 1.1em; font-weight: 600;"
          >
            {{ pintura.artista.nombreCompleto }} →
          </router-link>
        </div>

        <div>
          <h3 style="color: #667eea; margin-bottom: 8px;">Museo</h3>
          <router-link
            v-if="pintura.museo"
            :to="`/museos/${pintura.museo.id}`"
            style="color: #333; text-decoration: none; font-size: 1.1em; font-weight: 600;"
          >
            {{ pintura.museo.nombre }} →
          </router-link>
        </div>

        <div>
          <h3 style="color: #667eea; margin-bottom: 8px;">Año</h3>
          <p style="font-size: 1.1em;">{{ pintura.anio }}</p>
        </div>

        <div>
          <h3 style="color: #667eea; margin-bottom: 8px;">Técnica</h3>
          <p style="font-size: 1.1em;">{{ pintura.tecnica }}</p>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <h3 style="color: #667eea; margin-bottom: 8px;">Dimensiones</h3>
        <p style="font-size: 1.1em;">{{ pintura.dimensiones }}</p>
      </div>

      <div>
        <h3 style="color: #667eea; margin-bottom: 8px;">Descripción</h3>
        <p style="line-height: 1.8; font-size: 1.1em;">{{ pintura.descripcion }}</p>
      </div>

      <div style="margin-top: 32px;">
        <router-link to="/pinturas" class="btn btn-secondary">← Volver a Pinturas</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api/axios'

const route = useRoute()
const pintura = ref(null)
const loading = ref(true)
const error = ref('')

const loadPintura = async () => {
  try {
    loading.value = true
    const response = await api.get(`/pinturas/${route.params.id}`)
    pintura.value = response.data?.data ?? null
  } catch (err) {
    error.value = 'Error al cargar la pintura'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPintura()
})
</script>
