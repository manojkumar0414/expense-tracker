import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE = process.env.DB_DATABASE || 'ExpenseTrackerDB';
const DB_SERVER = process.env.DB_SERVER || 'localhost';
const DB_USER = process.env.DB_USER || 'sa';
const DB_PASSWORD = process.env.DB_PASSWORD || '';

// Connection configuration for Tedious driver (works on Linux)
const config = {
  server: DB_SERVER,
  database: DATABASE,
  authentication: {
    type: 'default',
    options: {
      userName: DB_USER,
      password: DB_PASSWORD,
    },
  },
  options: {
    encrypt: false,
    trustServerCertificate: true,
    connectionTimeout: 30000,
  },
};

let connectionPool;

async function initializePool() {
  if (!connectionPool) {
    connectionPool = new sql.ConnectionPool(config);
    await connectionPool.connect();
    console.log('✓ Connected to MSSQL database via mssql/tedious');
  }
  return connectionPool;
}

async function executeQuery(query, params = {}) {
  try {
    const pool = await initializePool();

    // Replace @paramName placeholders with the actual values
    let finalQuery = query;
    Object.keys(params).forEach((key) => {
      const value = params[key];
      let formattedValue = '';

      if (value === null || value === undefined) {
        formattedValue = 'NULL';
      } else if (typeof value === 'string') {
        formattedValue = `'${value.replace(/'/g, "''")}'`;
      } else if (typeof value === 'boolean') {
        formattedValue = value ? '1' : '0';
      } else {
        formattedValue = value;
      }

      finalQuery = finalQuery.replace(new RegExp(`@${key}\\b`, 'g'), formattedValue);
    });

    const request = pool.request();
    const result = await request.query(finalQuery);
    return result.recordset;
  } catch (err) {
    console.error('Query error:', err.message);
    throw err;
  }
}

export { executeQuery };
