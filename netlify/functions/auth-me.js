import { getUserFromToken, successResponse, errorResponse, handleOptions } from './utils.js';

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  if (event.httpMethod !== 'GET') {
    return errorResponse(405, 'Método no permitido');
  }

  try {
    const user = getUserFromToken(event);

    if (!user) {
      return errorResponse(401, 'No autenticado');
    }

    return successResponse(user);

  } catch (error) {
    console.error('Error en auth-me:', error);
    return errorResponse(500, 'Error interno del servidor');
  }
}
