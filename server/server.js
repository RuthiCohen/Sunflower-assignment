import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import leaderboardRoutes from './routes/leaderboard.js';

dotenv.config();

const fastify = Fastify({ logger: true });

const PORT = process.env.PORT || 3000;
const ORIGINS = (process.env.CLIENT_ORIGIN || 'http://localhost:3001').split(',');
const METHODS = (process.env.CLIENT_METHODS || 'GET,POST,PUT,DELETE,OPTIONS').split(',');
const HEADERS = (process.env.CLIENT_HEADERS || 'Content-Type,Authorization').split(',');

await fastify.register(cors, {
  origin: ORIGINS,
  methods: METHODS,
  allowedHeaders: HEADERS,
});

await fastify.register(leaderboardRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
