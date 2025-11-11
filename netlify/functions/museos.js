import { getRedisClient, setJSON, getJSON, deleteKey, getAllByPattern } from './redis-client.js';
import { getUserFromToken, successResponse, errorResponse, handleOptions, generateId } from './utils.js';

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  try {
    const user = getUserFromToken(event);
    if (!user) {
      return errorResponse(401, 'No autenticado');
    }

    await getRedisClient();

    let path = event.path || '';
    path = path.replace('/.netlify/functions/museos', '');
    path = path.replace('/api/museos', '');
    const segments = path.split('/').filter(Boolean);
    const id = segments[0];

    // GET /api/museos - Obtener todos los museos
    if (event.httpMethod === 'GET' && !id) {
      const museos = await getAllByPattern('museo:*');
      
      return successResponse({
        count: museos.length,
        museos: museos.sort((a, b) => a.nombre.localeCompare(b.nombre))
      });
    }

    // GET /api/museos/:id - Obtener un museo por ID
    if (event.httpMethod === 'GET' && id) {
      const museo = await getJSON(`museo:${id}`);
      
      if (!museo) {
        return errorResponse(404, 'Museo no encontrado');
      }

      // Obtener colección del museo
      const todasPinturas = await getAllByPattern('pintura:*');
      museo.coleccion = todasPinturas.filter(p => p.museoId === id);

      return successResponse(museo);
    }

    // POST /api/museos - Crear nuevo museo
    if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body);
      const newId = generateId();
      
      const museo = {
        id: newId,
        nombre: data.nombre,
        ciudad: data.ciudad,
        pais: data.pais,
        fundacion: data.fundacion,
        descripcion: data.descripcion,
        imagenUrl: data.imagenUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setJSON(`museo:${newId}`, museo);
      
      return successResponse(museo, 201);
    }

    // PUT /api/museos/:id - Actualizar museo
    if (event.httpMethod === 'PUT' && id) {
      const existing = await getJSON(`museo:${id}`);
      
      if (!existing) {
        return errorResponse(404, 'Museo no encontrado');
      }

      const data = JSON.parse(event.body);
      const updated = {
        ...existing,
        ...data,
        id: existing.id,
        updatedAt: new Date().toISOString()
      };

      await setJSON(`museo:${id}`, updated);
      
      return successResponse(updated);
    }

    // DELETE /api/museos/:id - Eliminar museo
    if (event.httpMethod === 'DELETE' && id) {
      const existing = await getJSON(`museo:${id}`);
      
      if (!existing) {
        return errorResponse(404, 'Museo no encontrado');
      }

      await deleteKey(`museo:${id}`);
      
      return successResponse({ message: 'Museo eliminado exitosamente' });
    }

    return errorResponse(405, 'Método no permitido');

  } catch (error) {
    console.error('Error en museos:', error);
    return errorResponse(500, error.message || 'Error interno del servidor');
  }
}
