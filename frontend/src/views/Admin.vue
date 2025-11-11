<template>
  <div class="container">
    <div class="card" style="max-width: 1000px; margin: 0 auto;">
      <h1 style="color: #667eea; margin-bottom: 24px;">🔐 Panel de Administrador</h1>

      <div class="success" v-if="successMessage">{{ successMessage }}</div>
      <div class="error" v-if="errorMessage">{{ errorMessage }}</div>

      <div style="background: #f8f9fa; padding: 24px; border-radius: 12px; margin-bottom: 32px;">
        <h2 style="margin-bottom: 16px;">Procesamiento de Cola RabbitMQ</h2>
        <p style="line-height: 1.6; margin-bottom: 16px;">
          Este panel permite procesar todas las actualizaciones pendientes (crear, actualizar, eliminar) 
          que están en la cola de RabbitMQ y aplicarlas a la base de datos MongoDB.
        </p>
        <p style="line-height: 1.6; color: #856404; background: #fff3cd; padding: 12px; border-radius: 8px;">
          <strong>⚠️ Importante:</strong> Solo los administradores pueden ejecutar esta operación.
        </p>
      </div>

      <button 
        @click="processQueue" 
        class="btn btn-primary" 
        :disabled="processing"
        style="font-size: 1.1em; padding: 16px 32px;"
      >
        {{ processing ? 'Procesando...' : '▶️ Procesar Cola de Actualizaciones' }}
      </button>

      <div v-if="results" style="margin-top: 32px;">
        <h3 style="color: #667eea; margin-bottom: 16px;">Resultados del Procesamiento</h3>
        
        <div style="background: #d4edda; border: 2px solid #28a745; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
          <p style="font-size: 1.2em; font-weight: 600; color: #155724;">
            ✅ Procesados: {{ results.processed }} | ❌ Errores: {{ results.errors }}
          </p>
          <p style="color: #155724; margin-top: 8px;">{{ results.message }}</p>
        </div>

        <div v-if="results.results && results.results.length > 0">
          <h4 style="margin-bottom: 16px;">Detalle de Operaciones:</h4>
          <div style="max-height: 400px; overflow-y: auto;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f8f9fa; border-bottom: 2px solid #dee2e6;">
                  <th style="padding: 12px; text-align: left;">Operación</th>
                  <th style="padding: 12px; text-align: left;">Entidad</th>
                  <th style="padding: 12px; text-align: left;">Estado</th>
                  <th style="padding: 12px; text-align: left;">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(result, index) in results.results" 
                  :key="index"
                  style="border-bottom: 1px solid #dee2e6;"
                >
                  <td style="padding: 12px;">{{ result.operation }}</td>
                  <td style="padding: 12px;">{{ result.entity }}</td>
                  <td style="padding: 12px;">
                    <span 
                      :style="{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        background: result.status === 'success' ? '#d4edda' : '#f8d7da',
                        color: result.status === 'success' ? '#155724' : '#721c24',
                        fontWeight: 600
                      }"
                    >
                      {{ result.status }}
                    </span>
                  </td>
                  <td style="padding: 12px; font-size: 0.9em; color: #666;">
                    {{ new Date(result.timestamp).toLocaleString('es-ES') }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-else style="padding: 20px; background: #f8f9fa; border-radius: 12px; text-align: center;">
          <p style="color: #666;">No hay operaciones pendientes en la cola</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../api/axios'

const processing = ref(false)
const results = ref(null)
const successMessage = ref('')
const errorMessage = ref('')

const processQueue = async () => {
  try {
    processing.value = true
    successMessage.value = ''
    errorMessage.value = ''
    results.value = null

    const response = await api.post('/process-queue')
    results.value = response.data.data
    successMessage.value = '✅ Cola procesada exitosamente'
  } catch (err) {
    errorMessage.value = err.response?.data?.error || 'Error al procesar la cola'
    console.error(err)
  } finally {
    processing.value = false
  }
}
</script>
