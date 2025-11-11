import { createClient } from 'redis';

let client = null;

export async function getRedisClient() {
  if (client && client.isOpen) {
    return client;
  }

  try {
    const redisUrl = process.env.REDIS_URL;
    
    // Configuración del cliente según el protocolo
    const config = {
      url: redisUrl
    };

    // Si la URL usa rediss:// (TLS), configurar TLS
    if (redisUrl.startsWith('rediss://')) {
      config.socket = {
        tls: true,
        rejectUnauthorized: false
      };
    }

    client = createClient(config);

    client.on('error', (err) => console.error('Redis Client Error:', err));

    await client.connect();
    console.log('✅ Conectado a Redis');
    
    return client;
  } catch (error) {
    console.error('❌ Error conectando a Redis:', error);
    throw error;
  }
}

export async function closeRedisClient() {
  if (client && client.isOpen) {
    await client.quit();
    client = null;
  }
}

// Utilidades para manejar datos en Redis
export async function setJSON(key, value, expirationSeconds = null) {
  const redis = await getRedisClient();
  const data = JSON.stringify(value);
  
  if (expirationSeconds) {
    await redis.setEx(key, expirationSeconds, data);
  } else {
    await redis.set(key, data);
  }
}

export async function getJSON(key) {
  const redis = await getRedisClient();
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}

export async function deleteKey(key) {
  const redis = await getRedisClient();
  await redis.del(key);
}

export async function getAllKeys(pattern) {
  const redis = await getRedisClient();
  return await redis.keys(pattern);
}

export async function getAllByPattern(pattern) {
  const keys = await getAllKeys(pattern);
  const results = [];
  
  for (const key of keys) {
    const data = await getJSON(key);
    if (data) {
      results.push({ key, ...data });
    }
  }
  
  return results;
}
