import 'dotenv/config';
import { createClient } from 'redis';
import { artistas, museos, pinturas } from '../shared/catalog-data.js';
import { CATALOG_SEED_FLAG } from '../shared/constants.js';

const withTimestamps = (entity) => ({
  ...entity,
  createdAt: entity.createdAt ?? new Date().toISOString(),
  updatedAt: entity.updatedAt ?? new Date().toISOString()
});

async function seed() {
  let client = null;

  try {
    console.log('🌱 Iniciando carga de datos en Redis...');

    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
      throw new Error('REDIS_URL no está configurada en .env');
    }

    console.log('🔗 Conectando a Redis...');

    const config = {
      url: redisUrl
    };

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

    const keys = await client.keys('*');
    if (keys.length > 0) {
      const dataKeys = keys.filter(
        (k) =>
          k.startsWith('pintura:') ||
          k.startsWith('artista:') ||
          k.startsWith('museo:') ||
          k === CATALOG_SEED_FLAG
      );

      if (dataKeys.length > 0) {
        await client.del(...dataKeys);
        console.log(`🗑️  ${dataKeys.length} registros anteriores eliminados`);
      }
    }

    for (const artista of artistas) {
      await client.set(`artista:${artista.id}`, JSON.stringify(withTimestamps(artista)));
    }
    console.log(`✅ ${artistas.length} artistas creados`);

    for (const museo of museos) {
      await client.set(`museo:${museo.id}`, JSON.stringify(withTimestamps(museo)));
    }
    console.log(`✅ ${museos.length} museos creados`);

    for (const pintura of pinturas) {
      await client.set(`pintura:${pintura.id}`, JSON.stringify(withTimestamps(pintura)));
    }
    console.log(`✅ ${pinturas.length} pinturas creadas`);

    await client.set(CATALOG_SEED_FLAG, new Date().toISOString());

    console.log('\n🎉 ¡Carga de datos completada exitosamente!');
    console.log(`📊 Total: ${artistas.length} artistas, ${museos.length} museos, ${pinturas.length} pinturas`);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.quit();
    }
  }
}

seed();
