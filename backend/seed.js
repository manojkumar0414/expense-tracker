import bcrypt from 'bcryptjs';
import { executeQuery } from './db.js';

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with hashed passwords...');

    // Delete existing users
    await executeQuery('DELETE FROM Users');
    console.log('✓ Cleared existing users');

    // Create sample users with hashed passwords
    const users = [
      { username: 'admin', password: 'admin123', email: 'admin@example.com' },
      { username: 'user1', password: 'user123', email: 'user1@example.com' },
    ];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await executeQuery(
        'INSERT INTO Users (Username, Password, Email) VALUES (@username, @password, @email)',
        { username: user.username, password: hashedPassword, email: user.email }
      );
      console.log(`✓ Created user: ${user.username}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\nYou can now login with:');
    console.log('  Username: admin, Password: admin123');
    console.log('  Username: user1, Password: user123');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
    process.exit(1);
  }
}

seedDatabase();
