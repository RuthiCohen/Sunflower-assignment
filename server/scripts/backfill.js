import dotenv from "dotenv";
dotenv.config();
import db from "../services/db.js";
import redis from "../services/redis.js";

const run = async () => {
  const { rows } = await db.query("SELECT id, score FROM users");
  const pipe = redis.pipeline();
  for (const r of rows) pipe.zadd("leaderboard", r.score ?? 0, String(r.id));
  await pipe.exec();
  console.log(`Backfilled ${rows.length} users into Redis ZSET`);
  await redis.quit();
  process.exit(0);
};

run().catch(async (e) => {
  console.error(e);
  await redis.quit();
  process.exit(1);
});
