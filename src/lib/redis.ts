import Redis from 'ioredis';
import { REDIS_URL } from 'astro:env/server';
import { logger } from './logger';

let redisClient: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (!REDIS_URL) return null;

  if (!redisClient) {
    redisClient = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 1,
      lazyConnect: true,
    });

    redisClient.on('error', (error) => {
      logger.error('Redis connection error', { error });
    });
  }

  return redisClient;
}
