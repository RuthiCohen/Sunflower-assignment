import Redis from 'ioredis';

const redis = new Redis('redis://localhost:6379', {
  maxRetriesPerRequest: 3,
});

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.error('Redis error:', err));

export default redis;
