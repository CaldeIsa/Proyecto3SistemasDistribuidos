<template>
  <div class="container">
    <h1 style="color: white; margin-bottom: 32px; font-size: 2.5em;">👨‍🎨 Artistas Famosos</h1>

    <div v-if="loading" class="loading">Cargando artistas...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else class="grid">
      <router-link
        v-for="artista in artistas"
        :key="artista.id"
        :to="`/artistas/${artista.id}`"
        class="entity-card"
      >
        <img :src="artista.imagenUrl" :alt="artista.nombreCompleto" class="entity-card-image" />
        <div class="entity-card-content">
          <div class="entity-card-title">{{ artista.nombreCompleto }}</div>
          <div class="entity-card-subtitle">
            {{ artista.nacionalidad || 'Nacionalidad desconocida' }}
          </div>
          <div class="entity-card-text">
            {{ artista.biografia ? artista.biografia.slice(0, 120) + (artista.biografia.length > 120 ? '…' : '') : 'Sin biografía disponible' }}
          </div>
          <div style="margin-top: 12px;">
            <span style="background: #f0f0f0; padding: 6px 12px; border-radius: 12px; font-size: 0.9em;">
              {{ new Date(artista.fechaNacimiento).getFullYear() }} -
              {{ artista.fechaMuerte ? new Date(artista.fechaMuerte).getFullYear() : 'Presente' }}
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

const artistas = ref([])
const loading = ref(true)
const error = ref('')

const loadArtistas = async () => {
  try {
    loading.value = true
    const response = await api.get('/artistas')
    artistas.value = response.data?.data?.artistas ?? []
  } catch (err) {
    error.value = 'Error al cargar los artistas'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadArtistas()
})
</script>
