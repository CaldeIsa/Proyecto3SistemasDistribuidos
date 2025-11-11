import bcrypt from 'bcryptjs';
import { getRedisClient } from './redis-client.js';
import { artistas, museos, pinturas } from '../../shared/catalog-data.js';
import { defaultUsers } from '../../shared/default-users.js';
import { CATALOG_SEED_FLAG, USERS_SEED_FLAG } from '../../shared/constants.js';

function withTimestamps(entity) {
  return {
    ...entity,
    createdAt: entity.createdAt ?? new Date().toISOString(),
    updatedAt: entity.updatedAt ?? new Date().toISOString()
  };
}

export async function ensureCatalogSeed(providedClient) {
  const client = providedClient ?? (await getRedisClient());

  const alreadySeeded = await client.get(CATALOG_SEED_FLAG);
  if (alreadySeeded) {
    return;
  }

  const pipeline = client.multi();

  for (const artista of artistas) {
    pipeline.set(`artista:${artista.id}`, JSON.stringify(withTimestamps(artista)));
  }

  for (const museo of museos) {
    pipeline.set(`museo:${museo.id}`, JSON.stringify(withTimestamps(museo)));
  }

  for (const pintura of pinturas) {
    pipeline.set(`pintura:${pintura.id}`, JSON.stringify(withTimestamps(pintura)));
  }

  pipeline.set(CATALOG_SEED_FLAG, new Date().toISOString());

  await pipeline.exec();
}

export async function ensureDefaultUsers(providedClient) {
  const client = providedClient ?? (await getRedisClient());

  const alreadySeeded = await client.get(USERS_SEED_FLAG);
  if (alreadySeeded) {
    return;
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
}
