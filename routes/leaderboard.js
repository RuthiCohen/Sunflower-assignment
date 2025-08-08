import db from '../services/db.js';

export default async function (fastify, opts) {


  // Add a new user
  fastify.post('/users', async (req, res) => {
    const { name, image_url, score } = req.body;
    const result = await db.query(
      'INSERT INTO users (name, image_url, score) VALUES ($1, $2, $3) RETURNING *',
      [name, image_url, score]
    );
    return result.rows[0];
  });

  // Update score
  fastify.put('/users/:id/score', async (req, res) => {
    const { id } = req.params;
    const { score } = req.body;
    const result = await db.query(
      'UPDATE users SET score = $1 WHERE id = $2 RETURNING *',
      [score, id]
    );
    return result.rows[0];
  });

  // Top N users
  fastify.get('/leaderboard/top/:n', async (req, res) => {
    const { n } = req.params;
    const result = await db.query(
      'SELECT * FROM users ORDER BY score DESC LIMIT $1',
      [n]
    );
    return result.rows;
  });

  // User position with +-5 context
  fastify.get('/leaderboard/user/:id', async (req, res) => {
    const { id } = req.params;
    const userResult = await db.query(
      'SELECT id, score FROM users WHERE id = $1',
      [id]
    );
    if (userResult.rows.length === 0) return res.code(404).send({ error: 'User not found' });

    const { score } = userResult.rows[0];
    const positionResult = await db.query(
      'SELECT COUNT(*) + 1 AS position FROM users WHERE score > $1',
      [score]
    );
    const position = parseInt(positionResult.rows[0].position);

    const contextResult = await db.query(
      `SELECT * FROM (
         SELECT *, ROW_NUMBER() OVER (ORDER BY score DESC) AS rank FROM users
       ) AS ranked
       WHERE rank BETWEEN $1 AND $2`,
      [position - 5, position + 5]
    );

    return {
      userPosition: position,
      context: contextResult.rows,
    };
  });
}
