import 'dotenv/config';
import { createClient } from 'redis';
import bcrypt from 'bcryptjs';
import { defaultUsers } from '../shared/default-users.js';
import { USERS_SEED_FLAG } from '../shared/constants.js';

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error('REDIS_URL no está configurada en .env');
}

const config = {
  url: redisUrl
};

if (redisUrl?.startsWith('rediss://')) {
  config.socket = {
    tls: true,
    rejectUnauthorized: false
  };
}

const client = createClient(config);

client.on('error', (err) => console.error('Redis Client Error:', err));

async function seedUsers() {
  try {
    console.log('🌱 Creando usuarios de prueba...');

    await client.connect();
    console.log('✅ Conectado a Redis');

    const userKeys = await client.keys('usuario:*');
    const keysToDelete = [...userKeys];

    const metaExists = await client.exists(USERS_SEED_FLAG);
    if (metaExists) {
      keysToDelete.push(USERS_SEED_FLAG);
    }

    if (keysToDelete.length > 0) {
      await client.del(...keysToDelete);
      console.log(`🗑️  ${keysToDelete.length} claves de usuario eliminadas`);
    }

    for (const user of defaultUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const now = new Date().toISOString();
      const payload = {
        ...user,
        password: hashedPassword,
        createdAt: now,
        updatedAt: now
      };

      await client.set(`usuario:${user.id}`, JSON.stringify(payload));
    }

    await client.set(USERS_SEED_FLAG, new Date().toISOString());

    console.log(`✅ ${defaultUsers.length} usuarios creados`);
    console.log('\n👥 Usuarios de prueba:');
    for (const user of defaultUsers) {
      console.log(`${user.role === 'admin' ? 'Admin' : 'Usuario'}: username=${user.username}, password=${user.password}`);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.quit();
  }
}

seedUsers();
