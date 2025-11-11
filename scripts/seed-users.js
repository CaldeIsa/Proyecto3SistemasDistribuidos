import 'dotenv/config';
import { createClient } from 'redis';
import bcrypt from 'bcryptjs';

const client = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false
  }
});

client.on('error', (err) => console.error('Redis Client Error:', err));

async function seedUsers() {
  try {
    console.log('🌱 Creando usuarios de prueba...');
    
    await client.connect();
    console.log('✅ Conectado a Redis');

    // Limpiar usuarios anteriores
    const userKeys = await client.keys('usuario:*');
    if (userKeys.length > 0) {
      await client.del(userKeys);
      console.log('🗑️  Usuarios anteriores eliminados');
    }

    // Crear usuarios
    const users = [
      {
        id: 'admin',
        username: 'admin',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
        createdAt: new Date().toISOString()
      },
      {
        id: 'usuario',
        username: 'usuario',
        password: await bcrypt.hash('usuario123', 10),
        role: 'user',
        createdAt: new Date().toISOString()
      }
    ];

    for (const user of users) {
      await client.set(`usuario:${user.id}`, JSON.stringify(user));
    }

    console.log(`✅ ${users.length} usuarios creados`);
    console.log('\n👥 Usuarios de prueba:');
    console.log('Admin: username=admin, password=admin123');
    console.log('Usuario: username=usuario, password=usuario123');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.quit();
  }
}

seedUsers();
