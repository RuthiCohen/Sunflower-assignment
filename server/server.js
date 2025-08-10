import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import leaderboardRoutes from './routes/leaderboard.js';
import db from './services/db.js';
import redis from './services/redis.js';

dotenv.config();

const fastify = Fastify({ logger: true });

const PORT    = Number(process.env.PORT || 3000);
const ORIGINS = (process.env.CLIENT_ORIGIN || 'http://localhost:3001').split(',');
const METHODS = (process.env.CLIENT_METHODS || 'GET,POST,PUT,DELETE,OPTIONS').split(',');
const HEADERS = (process.env.CLIENT_HEADERS || 'Content-Type,Authorization').split(',');

// CORS first
await fastify.register(cors, {
  origin: ORIGINS,
  methods: METHODS,
  allowedHeaders: HEADERS,
});

// routes
await fastify.register(leaderboardRoutes);

// health
fastify.get('/healthz', async () => ({ ok: true }));

// backfill Redis ZSET from DB so rank endpoints are instant
async function backfillLeaderboard() {
  const { rows } = await db.query('SELECT id, score FROM users');
  if (!rows.length) return;
  const pipe = redis.pipeline();
  for (const r of rows) pipe.zadd('leaderboard', r.score ?? 0, String(r.id));
  await pipe.exec();
  fastify.log.info(`Redis ZSET backfilled with ${rows.length} users`);
}

const start = async () => {
  try {
    await backfillLeaderboard();
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// shutdown
const shutdown = async () => {
  try {
    await fastify.close();
    await redis.quit();
    process.exit(0);
  } catch {
    process.exit(1);
  }
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start();
