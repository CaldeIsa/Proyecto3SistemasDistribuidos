import { getRedisClient, setJSON, getJSON, deleteKey, getAllByPattern } from './redis-client.js';
import { getUserFromToken, successResponse, errorResponse, handleOptions, generateId } from './utils.js';

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  try {
    const user = getUserFromToken(event);
    const requiresAuth = !['GET', 'OPTIONS'].includes(event.httpMethod);

    if (requiresAuth && !user) {
      return errorResponse(401, 'No autenticado');
    }

    await getRedisClient();

    let path = event.path || '';
    path = path.replace('/.netlify/functions/artistas', '');
    path = path.replace('/api/artistas', '');
    const segments = path.split('/').filter(Boolean);
    const id = segments[0];

    // GET /api/artistas - Obtener todos los artistas
    if (event.httpMethod === 'GET' && !id) {
      const artistas = await getAllByPattern('artista:*');
      
      return successResponse({
        count: artistas.length,
        artistas: artistas.sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto))
      });
    }

    // GET /api/artistas/:id - Obtener un artista por ID
    if (event.httpMethod === 'GET' && id) {
      const artista = await getJSON(`artista:${id}`);
      
      if (!artista) {
        return errorResponse(404, 'Artista no encontrado');
      }

      // Obtener obras del artista
      const todasPinturas = await getAllByPattern('pintura:*');
      artista.obras = todasPinturas.filter(p => p.artistaId === id);

      return successResponse(artista);
    }

    // POST /api/artistas - Crear nuevo artista
    if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body);
      const newId = generateId();
      
      const artista = {
        id: newId,
        nombreCompleto: data.nombreCompleto,
        fechaNacimiento: data.fechaNacimiento,
        fechaMuerte: data.fechaMuerte,
        nacionalidad: data.nacionalidad,
        biografia: data.biografia,
        imagenUrl: data.imagenUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setJSON(`artista:${newId}`, artista);
      
      return successResponse(artista, 201);
    }

    // PUT /api/artistas/:id - Actualizar artista
    if (event.httpMethod === 'PUT' && id) {
      const existing = await getJSON(`artista:${id}`);
      
      if (!existing) {
        return errorResponse(404, 'Artista no encontrado');
      }

      const data = JSON.parse(event.body);
      const updated = {
        ...existing,
        ...data,
        id: existing.id,
        updatedAt: new Date().toISOString()
      };

      await setJSON(`artista:${id}`, updated);
      
      return successResponse(updated);
    }

    // DELETE /api/artistas/:id - Eliminar artista
    if (event.httpMethod === 'DELETE' && id) {
      const existing = await getJSON(`artista:${id}`);
      
      if (!existing) {
        return errorResponse(404, 'Artista no encontrado');
      }

      await deleteKey(`artista:${id}`);
      
      return successResponse({ message: 'Artista eliminado exitosamente' });
    }

    return errorResponse(405, 'Método no permitido');

  } catch (error) {
    console.error('Error en artistas:', error);
    return errorResponse(500, error.message || 'Error interno del servidor');
  }
}
