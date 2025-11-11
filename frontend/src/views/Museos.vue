<template>
  <div class="container">
    <h1 style="color: white; margin-bottom: 32px; font-size: 2.5em;">🏛️ Museos Famosos</h1>

    <div v-if="loading" class="loading">Cargando museos...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else class="grid">
      <router-link
        v-for="museo in museos"
        :key="museo.id"
        :to="`/museos/${museo.id}`"
        class="entity-card"
      >
        <img :src="museo.imagenUrl" :alt="museo.nombre" class="entity-card-image" />
        <div class="entity-card-content">
          <div class="entity-card-title">{{ museo.nombre }}</div>
          <div class="entity-card-subtitle">{{ museo.ciudad }}, {{ museo.pais }}</div>
          <div class="entity-card-text">{{ museo.descripcion ? museo.descripcion.slice(0, 90) + (museo.descripcion.length > 90 ? '…' : '') : 'Sin descripción disponible' }}</div>
          <div style="margin-top: 12px;">
            <span style="background: #f0f0f0; padding: 6px 12px; border-radius: 12px; font-size: 0.9em;">
              Fundado en {{ museo.fundacion }}
            </span>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/axios'

const museos = ref([])
const loading = ref(true)
const error = ref('')

const loadMuseos = async () => {
  try {
    loading.value = true
    const response = await api.get('/museos')
    museos.value = response.data?.data?.museos ?? []
  } catch (err) {
    error.value = 'Error al cargar los museos'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMuseos()
})
</script>
