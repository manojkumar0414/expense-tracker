import { executeQuery } from './db.js';

export async function seed() {
  try {
    console.log('🌱 Creating database tables...');

    await executeQuery(`
      CREATE TABLE IF NOT EXISTS "Users" (
        "UserId" SERIAL PRIMARY KEY,
        "Username" VARCHAR(100) NOT NULL UNIQUE,
        "Password" VARCHAR(255) NOT NULL,
        "Email" VARCHAR(100),
        "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Users table created');

    await executeQuery(`
      CREATE TABLE IF NOT EXISTS "Categories" (
        "CategoryId" SERIAL PRIMARY KEY,
        "UserId" INTEGER NOT NULL REFERENCES "Users"("UserId") ON DELETE CASCADE,
        "Name" VARCHAR(100) NOT NULL,
        "Icon" VARCHAR(50),
        "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Categories table created');

    await executeQuery(`
      CREATE TABLE IF NOT EXISTS "Expenses" (
        "ExpenseId" SERIAL PRIMARY KEY,
        "UserId" INTEGER NOT NULL REFERENCES "Users"("UserId") ON DELETE CASCADE,
        "CategoryId" INTEGER NOT NULL REFERENCES "Categories"("CategoryId") ON DELETE CASCADE,
        "Amount" DECIMAL(10, 2) NOT NULL,
        "Date" DATE NOT NULL,
        "Note" VARCHAR(500),
        "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Expenses table created');
    console.log('✅ Database ready! Tables created. You can now register and create your own users.\n');
  } catch (err) {
    console.error('❌ Database error:', err.message);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seed().then(() => process.exit(0)).catch(() => process.exit(1));
}
