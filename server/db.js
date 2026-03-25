import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function initDb() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      id        SERIAL PRIMARY KEY,
      trainer   VARCHAR(255) DEFAULT '',
      cohort_name VARCHAR(255) DEFAULT '',
      dates     VARCHAR(255) DEFAULT '',
      students  JSONB DEFAULT '[]',
      grades    JSONB DEFAULT '{}',
      notes     JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('Database ready');
}
