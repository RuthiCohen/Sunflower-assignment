import Fastify from "fastify";
import dotenv from "dotenv";
import leaderboardRoutes from "./routes/leaderboard.js";

dotenv.config();

const fastify = Fastify({ logger: true });

fastify.register(leaderboardRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
