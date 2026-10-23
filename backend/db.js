import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const dbUrl = process.env.DATABASE_URL || 'postgresql://admin:Espa517FJP9qSOTePZ7pJ7SVWo1Bb0bDC@dpg-dbdpd90ae00c73ai8rc0-a.oregon-postgres.render.com/expensetracker_mdtg';

console.log(`📊 Database URL set: ${dbUrl ? 'Yes' : 'No'}`);
console.log(`🔐 Using: ${dbUrl ? 'Environment variable' : 'Fallback URL'}`);

const pool = new Pool({
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on('connect', () => {
  console.log('✓ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Pool error:', err.message);
});

export async function executeQuery(query, params = [], retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      try {
        const result = await client.query(query, params);
        return result.rows;
      } finally {
        client.release();
      }
    } catch (err) {
      console.error(`Query error (attempt ${i + 1}/${retries}):`, err.message);
      if (i === retries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

export default pool;
