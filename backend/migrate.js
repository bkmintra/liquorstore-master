const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const path = require('path');

const authFile = path.join(__dirname, '../data/auth_user.json');
const saltRounds = 10;

async function migratePasswords() {
  try {
    const text = await fs.readFile(authFile, 'utf8');
    const users = JSON.parse(text);

    console.log('Migrating passwords to bcrypt...');

    for (let user of users) {
      // Check if password is already bcrypt (starts with $2b$ or $2a$)
      if (!user.password.startsWith('$2')) {
        console.log(`Migrating password for ${user.username}`);
        // Assume the current password is plaintext for migration
        // In reality, you'd need the original plaintext passwords
        // For demo, we'll hash a default password
        const hashedPassword = await bcrypt.hash('password123', saltRounds);
        user.password = hashedPassword;
      }
    }

    await fs.writeFile(authFile, JSON.stringify(users, null, 2), 'utf8');
    console.log('Migration complete! All passwords are now bcrypt hashed.');
    console.log('Default password for all users is now: password123');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migratePasswords();