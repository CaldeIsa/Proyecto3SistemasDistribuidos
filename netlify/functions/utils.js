import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'proyecto3-secret-key';

// Generar token JWT
export function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id,
      username: user.username,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// Verificar y decodificar token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Extraer usuario del token en el header
export function getUserFromToken(event) {
  const authHeader = event.headers.authorization || event.headers.Authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  return verifyToken(token);
}

// Respuestas HTTP estandarizadas
export function successResponse(data, statusCode = 200) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    },
    body: JSON.stringify({
      success: true,
      data
    })
  };
}

export function errorResponse(statusCode, message) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    },
    body: JSON.stringify({
      success: false,
      error: message
    })
  };
}

export function handleOptions() {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    },
    body: ''
  };
}

// Generar ID único
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
