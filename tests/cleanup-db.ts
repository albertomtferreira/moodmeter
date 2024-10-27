// tests/cleanup-db.ts
import { PrismaClient } from '@prisma/client';
import { createInterface } from 'readline';

const prisma = new PrismaClient({
  log: ['warn', 'error'],
});

// Create readline interface
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

async function promptForConfirmation(): Promise<boolean> {
  return new Promise((resolve) => {
    rl.question('⚠️ This will delete ALL data from the database. Are you sure? (yes/no): ', (answer) => {
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
      rl.close();
    });
  });
}

async function cleanDatabase() {
  try {
    const confirmed = await promptForConfirmation();

    if (!confirmed) {
      console.log('❌ Cleanup cancelled');
      return;
    }

    console.log('🧹 Starting database cleanup...\n');

    // Delete records in the correct order to respect foreign key constraints
    console.log('Deleting mood entries...');
    const deletedMoods = await prisma.mood.deleteMany();
    console.log(`✅ Deleted ${deletedMoods.count} mood entries`);

    console.log('\nDeleting school-user associations...');
    const deletedSchoolUsers = await prisma.schoolUser.deleteMany();
    console.log(`✅ Deleted ${deletedSchoolUsers.count} school-user associations`);

    console.log('\nDeleting user settings...');
    const deletedUserSettings = await prisma.userSettings.deleteMany();
    console.log(`✅ Deleted ${deletedUserSettings.count} user settings`);

    console.log('\nDeleting school settings...');
    const deletedSchoolSettings = await prisma.schoolSettings.deleteMany();
    console.log(`✅ Deleted ${deletedSchoolSettings.count} school settings`);

    console.log('\nDeleting schools...');
    const deletedSchools = await prisma.school.deleteMany();
    console.log(`✅ Deleted ${deletedSchools.count} schools`);

    console.log('\nDeleting users...');
    const deletedUsers = await prisma.user.deleteMany();
    console.log(`✅ Deleted ${deletedUsers.count} users`);

    console.log('\n🎉 Database cleanup completed successfully!');

    // Optional: Show current count of all tables to verify cleanup
    const tablesCount = await getTotalRecordsCount();
    console.log('\nCurrent database state:');
    console.log(tablesCount);

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to get current count of records in all tables
async function getTotalRecordsCount() {
  return {
    moods: await prisma.mood.count(),
    schoolUsers: await prisma.schoolUser.count(),
    userSettings: await prisma.userSettings.count(),
    schoolSettings: await prisma.schoolSettings.count(),
    schools: await prisma.school.count(),
    users: await prisma.user.count(),
  };
}

// Execute the cleanup
cleanDatabase()
  .catch((e) => {
    console.error('Failed to clean database:', e);
    process.exit(1);
  });