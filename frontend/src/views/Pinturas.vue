<template>
  <div class="container">
    <h1 style="color: white; margin-bottom: 32px; font-size: 2.5em;">🖼️ Pinturas Famosas</h1>

    <div v-if="loading" class="loading">Cargando pinturas...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else class="grid">
      <router-link
        v-for="pintura in pinturas"
        :key="pintura.id"
        :to="`/pinturas/${pintura.id}`"
        class="entity-card"
      >
        <img :src="pintura.imagenUrl" :alt="pintura.titulo" class="entity-card-image" />
        <div class="entity-card-content">
          <div class="entity-card-title">{{ pintura.titulo }}</div>
          <div class="entity-card-subtitle">{{ pintura.artista?.nombreCompleto || 'Autor desconocido' }}</div>
          <div class="entity-card-text">{{ pintura.anio }}</div>
          <div style="margin-top: 12px;">
            <span style="background: #f0f0f0; padding: 6px 12px; border-radius: 12px; font-size: 0.9em;">
              {{ pintura.tecnica }}
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

const pinturas = ref([])
const loading = ref(true)
const error = ref('')

const loadPinturas = async () => {
  try {
    loading.value = true
    const response = await api.get('/pinturas')
    pinturas.value = response.data?.data?.pinturas ?? []
  } catch (err) {
    error.value = 'Error al cargar las pinturas'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPinturas()
})
</script>
