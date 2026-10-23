-- Create Users Table
CREATE TABLE IF NOT EXISTS "Users" (
  "UserId" SERIAL PRIMARY KEY,
  "Username" VARCHAR(100) NOT NULL UNIQUE,
  "Password" VARCHAR(255) NOT NULL,
  "Email" VARCHAR(100),
  "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Categories Table
CREATE TABLE IF NOT EXISTS "Categories" (
  "CategoryId" SERIAL PRIMARY KEY,
  "UserId" INTEGER NOT NULL REFERENCES "Users"("UserId") ON DELETE CASCADE,
  "Name" VARCHAR(100) NOT NULL,
  "Icon" VARCHAR(50),
  "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Expenses Table
CREATE TABLE IF NOT EXISTS "Expenses" (
  "ExpenseId" SERIAL PRIMARY KEY,
  "UserId" INTEGER NOT NULL REFERENCES "Users"("UserId") ON DELETE CASCADE,
  "CategoryId" INTEGER NOT NULL REFERENCES "Categories"("CategoryId") ON DELETE CASCADE,
  "Amount" DECIMAL(10, 2) NOT NULL,
  "Date" DATE NOT NULL,
  "Note" VARCHAR(500),
  "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Categories for user 1
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

COMMIT;
