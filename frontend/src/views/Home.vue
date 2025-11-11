<template>
  <div class="container">
    <header style="text-align: center; color: white; padding: 60px 20px;">
      <h1 style="font-size: 3em; margin-bottom: 16px;">🎨 Catálogo de Pinturas Famosas</h1>
      <p style="font-size: 1.3em; opacity: 0.9;">Explora obras maestras del arte mundial</p>
      <p style="margin-top: 16px; font-size: 1.1em;">Bienvenido, {{ authStore.user?.nombre }}!</p>
    </header>

    <div class="grid" style="margin-top: 48px;">
      <router-link to="/pinturas" class="entity-card">
        <div style="padding: 48px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <div style="font-size: 4em; margin-bottom: 16px;">🖼️</div>
          <h2 style="color: white; font-size: 2em; margin-bottom: 8px;">Pinturas</h2>
          <p style="color: rgba(255,255,255,0.9); font-size: 1.1em;">Explora las obras más famosas</p>
        </div>
      </router-link>

      <router-link to="/artistas" class="entity-card">
        <div style="padding: 48px; text-align: center; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
          <div style="font-size: 4em; margin-bottom: 16px;">👨‍🎨</div>
          <h2 style="color: white; font-size: 2em; margin-bottom: 8px;">Artistas</h2>
          <p style="color: rgba(255,255,255,0.9); font-size: 1.1em;">Conoce a los grandes maestros</p>
        </div>
      </router-link>

      <router-link to="/museos" class="entity-card">
        <div style="padding: 48px; text-align: center; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
          <div style="font-size: 4em; margin-bottom: 16px;">🏛️</div>
          <h2 style="color: white; font-size: 2em; margin-bottom: 8px;">Museos</h2>
          <p style="color: rgba(255,255,255,0.9); font-size: 1.1em;">Visita los museos más importantes</p>
        </div>
      </router-link>
    </div>

    <div v-if="authStore.isAdmin" class="card" style="margin-top: 48px; background: #fff3cd; border: 2px solid #ffc107;">
      <h3 style="color: #856404; margin-bottom: 16px;">🔐 Panel de Administrador</h3>
      <p style="color: #856404; margin-bottom: 16px;">
        Como administrador, puedes procesar la cola de actualizaciones pendientes.
      </p>
      <router-link to="/admin" class="btn btn-primary">Ir al Panel de Admin</router-link>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
</script>
