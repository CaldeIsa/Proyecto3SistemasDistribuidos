<template>
  <div class="container">
    <div v-if="loading" class="loading">Cargando...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else-if="artista" class="card" style="max-width: 1000px; margin: 0 auto;">
      <img :src="artista.imagenUrl" :alt="artista.nombreCompleto" style="width: 100%; max-height: 400px; object-fit: contain; border-radius: 12px; margin-bottom: 32px;" />
      
      <h1 style="color: #667eea; margin-bottom: 24px;">{{ artista.nombreCompleto }}</h1>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin-bottom: 32px;">
        <div>
          <h3 style="color: #667eea; margin-bottom: 8px;">Movimiento</h3>
          <p style="font-size: 1.1em;">{{ artista.movimiento }}</p>
        </div>

        <div>
          <h3 style="color: #667eea; margin-bottom: 8px;">Nacionalidad</h3>
          <p style="font-size: 1.1em;">{{ artista.nacionalidad }}</p>
        </div>

        <div>
          <h3 style="color: #667eea; margin-bottom: 8px;">Vida</h3>
          <p style="font-size: 1.1em;">
            {{ new Date(artista.fechaNacimiento).toLocaleDateString('es-ES') }} - 
            {{ artista.fechaMuerte ? new Date(artista.fechaMuerte).toLocaleDateString('es-ES') : 'Presente' }}
          </p>
        </div>
      </div>

      <div style="margin-bottom: 32px;">
        <h3 style="color: #667eea; margin-bottom: 8px;">Biografía</h3>
        <p style="line-height: 1.8; font-size: 1.1em;">{{ artista.biografia }}</p>
      </div>

      <div v-if="artista.pinturas && artista.pinturas.length > 0">
        <h3 style="color: #667eea; margin-bottom: 16px;">Obras en el catálogo ({{ artista.pinturas.length }})</h3>
        <div class="grid">
          <router-link 
            v-for="pintura in artista.pinturas" 
            :key="pintura._id" 
            :to="`/pinturas/${pintura._id}`"
            class="entity-card"
          >
            <img :src="pintura.imagenUrl" :alt="pintura.titulo" class="entity-card-image" />
            <div class="entity-card-content">
              <div class="entity-card-title">{{ pintura.titulo }}</div>
              <div class="entity-card-text">{{ pintura.anio }}</div>
            </div>
          </router-link>
        </div>
      </div>

      <div style="margin-top: 32px;">
        <router-link to="/artistas" class="btn btn-secondary">← Volver a Artistas</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api/axios'

const route = useRoute()
const artista = ref(null)
const loading = ref(true)
const error = ref('')

const loadArtista = async () => {
  try {
    loading.value = true
    const response = await api.get(`/artistas-get/${route.params.id}`)
    artista.value = response.data.data
  } catch (err) {
    error.value = 'Error al cargar el artista'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadArtista()
})
</script>
