import bcrypt from 'bcryptjs';
import { getRedisClient, setJSON, getJSON } from './redis-client.js';
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

    if (password.length < 6) {
      return errorResponse(400, 'La contraseña debe tener al menos 6 caracteres');
    }

    await getRedisClient();

    // Verificar si el usuario ya existe
    const existing = await getJSON(`usuario:${username}`);

    if (existing) {
      return errorResponse(400, 'El usuario ya existe');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = {
      id: username,
      username,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    await setJSON(`usuario:${username}`, user);

    // Generar token
    const token = generateToken(user);

    return successResponse({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    }, 201);

  } catch (error) {
    console.error('Error en registro:', error);
    return errorResponse(500, 'Error interno del servidor');
  }
}
