import { getRedisClient, setJSON, getJSON, deleteKey, getAllByPattern } from './redis-client.js';
import { getUserFromToken, successResponse, errorResponse, handleOptions, generateId } from './utils.js';

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  try {
    // Verificar autenticación
    const user = getUserFromToken(event);
    if (!user) {
      return errorResponse(401, 'No autenticado');
    }

    await getRedisClient();

    // Extraer ID del path
    let path = event.path || '';
    path = path.replace('/.netlify/functions/pinturas', '');
    path = path.replace('/api/pinturas', '');
    const segments = path.split('/').filter(Boolean);
    const id = segments[0];

    // GET /api/pinturas - Obtener todas las pinturas
    if (event.httpMethod === 'GET' && !id) {
      const pinturas = await getAllByPattern('pintura:*');
      
      // Enriquecer con datos de artista y museo
      for (let pintura of pinturas) {
        if (pintura.artistaId) {
          pintura.artista = await getJSON(`artista:${pintura.artistaId}`);
        }
        if (pintura.museoId) {
          pintura.museo = await getJSON(`museo:${pintura.museoId}`);
        }
      }
      
      return successResponse({
        count: pinturas.length,
        pinturas: pinturas.sort((a, b) => a.titulo.localeCompare(b.titulo))
      });
    }

    // GET /api/pinturas/:id - Obtener una pintura por ID
    if (event.httpMethod === 'GET' && id) {
      const pintura = await getJSON(`pintura:${id}`);
      
      if (!pintura) {
        return errorResponse(404, 'Pintura no encontrada');
      }

      // Enriquecer con datos relacionados
      if (pintura.artistaId) {
        pintura.artista = await getJSON(`artista:${pintura.artistaId}`);
      }
      if (pintura.museoId) {
        pintura.museo = await getJSON(`museo:${pintura.museoId}`);
      }

      return successResponse(pintura);
    }

    // POST /api/pinturas - Crear nueva pintura
    if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body);
      const newId = generateId();
      
      const pintura = {
        id: newId,
        titulo: data.titulo,
        anio: data.anio,
        tecnica: data.tecnica,
        dimensiones: data.dimensiones,
        descripcion: data.descripcion,
        imagenUrl: data.imagenUrl,
        artistaId: data.artistaId,
        museoId: data.museoId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setJSON(`pintura:${newId}`, pintura);
      
      return successResponse(pintura, 201);
    }

    // PUT /api/pinturas/:id - Actualizar pintura
    if (event.httpMethod === 'PUT' && id) {
      const existing = await getJSON(`pintura:${id}`);
      
      if (!existing) {
        return errorResponse(404, 'Pintura no encontrada');
      }

      const data = JSON.parse(event.body);
      const updated = {
        ...existing,
        ...data,
        id: existing.id, // Mantener ID original
        updatedAt: new Date().toISOString()
      };

      await setJSON(`pintura:${id}`, updated);
      
      return successResponse(updated);
    }

    // DELETE /api/pinturas/:id - Eliminar pintura
    if (event.httpMethod === 'DELETE' && id) {
      const existing = await getJSON(`pintura:${id}`);
      
      if (!existing) {
        return errorResponse(404, 'Pintura no encontrada');
      }

      await deleteKey(`pintura:${id}`);
      
      return successResponse({ message: 'Pintura eliminada exitosamente' });
    }

    return errorResponse(405, 'Método no permitido');

  } catch (error) {
    console.error('Error en pinturas:', error);
    return errorResponse(500, error.message || 'Error interno del servidor');
  }
}
