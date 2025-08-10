import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is required');
}

const ssl =
  process.env.DB_SSL?.toLowerCase() === 'true'
    ? { rejectUnauthorized: false }
    : undefined;

const pool = new Pool({ connectionString, ssl });

pool.on('error', (err) => {
  console.error('PG pool error:', err);
});

export default pool;
