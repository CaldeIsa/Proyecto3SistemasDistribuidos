import bcrypt from 'bcryptjs';
import { getRedisClient, getJSON } from './redis-client.js';
import { ensureDefaultUsers } from './bootstrap.js';
import { generateToken, successResponse, errorResponse, handleOptions } from './utils.js';

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  if (event.httpMethod !== 'POST') {
    return errorResponse(405, 'Método no permitido');
  }

  try {
    const { username, password } = JSON.parse(event.body);

    if (!username || !password) {
      return errorResponse(400, 'Usuario y contraseña son requeridos');
    }

    const redis = await getRedisClient();
    await ensureDefaultUsers(redis);

    // Buscar usuario por username
    const user = await getJSON(`usuario:${username}`);

    if (!user) {
      return errorResponse(401, 'Credenciales inválidas');
    }

    // Verificar contraseña
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return errorResponse(401, 'Credenciales inválidas');
    }

    // Generar token
    const token = generateToken(user);

    return successResponse({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    return errorResponse(500, 'Error interno del servidor');
  }
}
