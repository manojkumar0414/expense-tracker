import bcrypt from 'bcryptjs';

async function generateHashes() {
  const users = [
    { username: 'admin', password: 'admin123' },
    { username: 'user1', password: 'user123' },
  ];

  console.log('\n🔐 Generating bcrypt hashes...\n');

  const hashes = {};
  for (const user of users) {
    const hash = await bcrypt.hash(user.password, 10);
    hashes[user.username] = hash;
    console.log(`Username: ${user.username}`);
    console.log(`Password: ${user.password}`);
    console.log(`Hash: ${hash}`);
    console.log('---\n');
  }

  console.log('✅ Copy and paste this SQL into SQL Server Management Studio:\n');
  console.log(`DELETE FROM Users;
GO

INSERT INTO Users (Username, Password, Email) VALUES
('admin', '${hashes.admin}', 'admin@example.com'),
('user1', '${hashes.user1}', 'user1@example.com');
GO

SELECT * FROM Users;
GO`);
}

generateHashes();
