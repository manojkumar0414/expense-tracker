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

    // Create default user if doesn't exist
    await executeQuery(`
      INSERT INTO "Users" ("Username", "Password", "Email")
      VALUES ('admin', 'demo123', 'admin@example.com')
      ON CONFLICT ("Username") DO NOTHING;
    `);
    console.log('✓ Default user created');

    // Clean up duplicate categories - keep only userId=1 system categories
    await executeQuery(`
      DELETE FROM "Categories" WHERE "UserId" != 1;
    `);
    console.log('✓ Cleaned up duplicate categories');

    // Insert default categories for userId=1
    await executeQuery(`
      INSERT INTO "Categories" ("UserId", "Name", "Icon") VALUES
      (1, 'Milk', '🥛'),
      (1, 'Gas', '⛽'),
      (1, 'Electricity', '⚡'),
      (1, 'EMI / Loan', '🏦'),
      (1, 'Groceries', '🛒'),
      (1, 'Vegetables', '🥬'),
      (1, 'Rent', '🏠'),
      (1, 'Mobile / Internet', '📱'),
      (1, 'Medical', '⚕️'),
      (1, 'Education', '📚'),
      (1, 'Transport', '🚗'),
      (1, 'Other', '📌')
      ON CONFLICT DO NOTHING;
    `);
    console.log('✓ Default categories initialized');
    console.log('✅ Database ready! Tables created. You can now register and create your own users.\n');
  } catch (err) {
    console.error('❌ Database error:', err.message);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seed().then(() => process.exit(0)).catch(() => process.exit(1));
}
