<template>
  <div class="container">
    <div v-if="loading" class="loading">Cargando...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else-if="museo" class="card" style="max-width: 1000px; margin: 0 auto;">
      <img :src="museo.imagenUrl" :alt="museo.nombre" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 12px; margin-bottom: 32px;" />
      
      <h1 style="color: #667eea; margin-bottom: 24px;">{{ museo.nombre }}</h1>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin-bottom: 32px;">
        <div>
          <h3 style="color: #667eea; margin-bottom: 8px;">Ubicación</h3>
          <p style="font-size: 1.1em;">{{ museo.ciudad }}, {{ museo.pais }}</p>
        </div>

        <div>
          <h3 style="color: #667eea; margin-bottom: 8px;">Tipo</h3>
          <p style="font-size: 1.1em;">{{ museo.tipo }}</p>
        </div>

        <div>
          <h3 style="color: #667eea; margin-bottom: 8px;">Fundación</h3>
          <p style="font-size: 1.1em;">{{ museo.fundacion }}</p>
        </div>

        <div v-if="museo.visitantesAnuales">
          <h3 style="color: #667eea; margin-bottom: 8px;">Visitantes Anuales</h3>
          <p style="font-size: 1.1em;">{{ museo.visitantesAnuales.toLocaleString('es-ES') }}</p>
        </div>
      </div>

      <div style="margin-bottom: 32px;">
        <h3 style="color: #667eea; margin-bottom: 8px;">Descripción</h3>
        <p style="line-height: 1.8; font-size: 1.1em;">{{ museo.descripcion }}</p>
      </div>

      <div v-if="museo.pinturas && museo.pinturas.length > 0">
        <h3 style="color: #667eea; margin-bottom: 16px;">Obras en la colección ({{ museo.pinturas.length }})</h3>
        <div class="grid">
          <router-link 
            v-for="pintura in museo.pinturas" 
            :key="pintura._id" 
            :to="`/pinturas/${pintura._id}`"
            class="entity-card"
          >
            <img :src="pintura.imagenUrl" :alt="pintura.titulo" class="entity-card-image" />
            <div class="entity-card-content">
              <div class="entity-card-title">{{ pintura.titulo }}</div>
              <div class="entity-card-subtitle">{{ pintura.artistaId?.nombreCompleto }}</div>
              <div class="entity-card-text">{{ pintura.anio }}</div>
            </div>
          </router-link>
        </div>
      </div>

      <div style="margin-top: 32px;">
        <router-link to="/museos" class="btn btn-secondary">← Volver a Museos</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api/axios'

const route = useRoute()
const museo = ref(null)
const loading = ref(true)
const error = ref('')

const loadMuseo = async () => {
  try {
    loading.value = true
    const response = await api.get(`/museos-get/${route.params.id}`)
    museo.value = response.data.data
  } catch (err) {
    error.value = 'Error al cargar el museo'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMuseo()
})
</script>
