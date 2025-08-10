import Redis from 'ioredis';

const url = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = new Redis(url, { maxRetriesPerRequest: 3 });

redis.on('connect', () => console.log('Redis connected', url));
redis.on('error', (err) => console.error('Redis error:', err));

export default redis;
