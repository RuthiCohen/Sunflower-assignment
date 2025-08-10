import db from "../services/db.js";
import redis from "../services/redis.js";

const TOP_CACHE_PREFIX = "leaderboard:top:";
const ALL_USERS_KEY = "users:all";

const TOP_TTL = Number(process.env.TOP_TTL ?? 30);
const USERS_TTL = Number(process.env.USERS_TTL ?? 15);

async function deleteTopCaches() {
  const stream = redis.scanStream({
    match: `${TOP_CACHE_PREFIX}*`,
    count: 200,
  });
  const keys = [];
  for await (const batch of stream) keys.push(...batch);
  if (keys.length) await redis.del(keys);
}

export const getAllUsers = async (req, res) => {
  try {
    const cached = await redis.get(ALL_USERS_KEY);
    if (cached) return JSON.parse(cached);

    const { rows } = await db.query("SELECT * FROM users ORDER BY id");
    await redis.set(ALL_USERS_KEY, JSON.stringify(rows), "EX", USERS_TTL);
    return rows;
  } catch (e) {
    req.log.error(e);
    return res.code(500).send({ error: "Failed to fetch users" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, image_url } = req.body;

    const { rows } = await db.query(
      "INSERT INTO users (name, image_url, score) VALUES ($1, $2, 0) RETURNING *",
      [name.trim(), image_url || null],
    );
    const user = rows[0];

    await redis.zadd("leaderboard", 0, String(user.id));
    await Promise.all([redis.del(ALL_USERS_KEY), deleteTopCaches()]);

    return user;
  } catch (e) {
    req.log.error(e);
    return res.code(500).send({ error: "Failed to create user" });
  }
};

export const updateUserScore = async (req, res) => {
  try {
    const id = req.params.id;
    const { score } = req.body;

    const { rows } = await db.query(
      "UPDATE users SET score = $1 WHERE id = $2 RETURNING *",
      [score, id],
    );
    const updated = rows[0];
    if (!updated) return res.code(404).send({ error: "User not found" });

    await redis.zadd("leaderboard", updated.score ?? 0, String(updated.id));
    await Promise.all([redis.del(ALL_USERS_KEY), deleteTopCaches()]);

    return updated;
  } catch (e) {
    req.log.error(e);
    return res.code(500).send({ error: "Failed to update score" });
  }
};

export const getTopUsers = async (req, res) => {
  try {
    const n = Math.max(1, Number(req.params.n));
    const cacheKey = `${TOP_CACHE_PREFIX}${n}`;

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const raw = await redis.zrevrange("leaderboard", 0, n - 1, "WITHSCORES");
    const ids = [];
    for (let i = 0; i < raw.length; i += 2) ids.push(Number(raw[i]));

    let rows;
    if (!ids.length) {
      ({ rows } = await db.query(
        "SELECT id, name, image_url, score FROM users ORDER BY score DESC LIMIT $1",
        [n],
      ));
    } else {
      ({ rows } = await db.query(
        `SELECT id, name, image_url, score
         FROM users
         WHERE id = ANY($1::bigint[])
         ORDER BY array_position($1::bigint[], id)`,
        [ids],
      ));
    }

    await redis.set(cacheKey, JSON.stringify(rows), "EX", TOP_TTL);
    return rows;
  } catch (e) {
    req.log.error(e);
    return res.code(500).send({ error: "Failed to fetch leaderboard" });
  }
};

export const getUserWithContext = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const rank = await redis.zrevrank("leaderboard", id);
    if (rank === null) return res.code(404).send({ error: "User not found" });

    const start = Math.max(rank - 5, 0);
    const end = rank + 5;

    const raw = await redis.zrevrange("leaderboard", start, end, "WITHSCORES");
    const ids = [];
    for (let i = 0; i < raw.length; i += 2) ids.push(Number(raw[i]));

    const { rows } = await db.query(
      `SELECT id, name, image_url, score
       FROM users
       WHERE id = ANY($1::bigint[])
       ORDER BY array_position($1::bigint[], id)`,
      [ids],
    );

    const context = rows.map((r, idx) => ({ ...r, rank: start + idx + 1 }));
    return { userPosition: rank + 1, context };
  } catch (e) {
    req.log.error(e);
    return res.code(500).send({ error: "Failed to fetch user context" });
  }
};
