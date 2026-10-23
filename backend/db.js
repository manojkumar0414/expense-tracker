import sql from 'msnodesqlv8';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE = process.env.DB_DATABASE || 'ExpenseTrackerDB';

// Use connection string with LocalDB
const connectionString = `Driver={ODBC Driver 17 for SQL Server};Server=(LocalDB)\\mssqllocaldb;Database=${DATABASE};Trusted_Connection=yes;`;

async function getConnection() {
  return new Promise((resolve, reject) => {
    sql.open(connectionString, (err, conn) => {
      if (err) {
        console.error('❌ Database connection error:', err.message);
        reject(err);
      } else {
        console.log('✓ Connected to MSSQL database via msnodesqlv8');
        resolve(conn);
      }
    });
  });
}

async function executeQuery(query, params = {}) {
  try {
    const conn = await getConnection();

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

    return new Promise((resolve, reject) => {
      conn.query(finalQuery, (err, rows) => {
        conn.close(() => {});
        if (err) {
          console.error('Query error:', err.message);
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  } catch (err) {
    console.error('Query error:', err.message);
    throw err;
  }
}

export { getConnection, executeQuery };
