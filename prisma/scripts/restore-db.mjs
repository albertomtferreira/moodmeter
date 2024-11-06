// scripts/restore-db.ts
// npx ts-node prisma/scripts/restore-db.mjs backup-2024-11-05T19-14-57-466Z.json

import { PrismaClient } from '@prisma/client';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

function createProgressBar(total, label) {
  let current = 0;
  return {
    increment() {
      current++;
      const percentage = Math.round((current / total) * 100);
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(
        `${label}: [${Array(Math.floor(percentage / 2)).fill('=').join('')}${
          Array(50 - Math.floor(percentage / 2)).fill(' ').join('')
        }] ${percentage}% (${current}/${total})`
      );
    },
    complete() {
      process.stdout.write('\n');
    }
  };
}

async function restoreBackup(filename) {
  try {
    console.log('Starting restore...');
    
    // Read and validate backup file
    const backupPath = path.join(__dirname, '../backups', filename);
    const backupData = JSON.parse(await readFile(backupPath, 'utf8'));

    // Backup file validation
    const requiredCollections = ['users', 'schools', 'schoolUsers', 'moods', 'userSettings', 'schoolSettings'];
    const missingCollections = requiredCollections.filter(collection => !backupData[collection]);
    if (missingCollections.length > 0) {
      throw new Error(`Backup file is missing required collections: ${missingCollections.join(', ')}`);
    }

    console.log('\nBackup Statistics:');
    console.table({
      Users: backupData.users.length,
      Schools: backupData.schools.length,
      'School Users': backupData.schoolUsers.length,
      Moods: backupData.moods.length,
      'User Settings': backupData.userSettings.length,
      'School Settings': backupData.schoolSettings.length,
    });

    // Ask for confirmation
    console.log('\n⚠️  WARNING: This will delete all existing data. Are you sure? (y/N)');
    const response = await new Promise(resolve => {
      process.stdin.resume();
      process.stdin.once('data', data => {
        process.stdin.pause();
        resolve(data.toString().trim().toLowerCase());
      });
    });

    if (response !== 'y') {
      console.log('Restore cancelled');
      return;
    }

    // Clear existing data
    console.log('\nClearing existing data...');
    await prisma.mood.deleteMany();
    await prisma.userSettings.deleteMany();
    await prisma.schoolSettings.deleteMany();
    await prisma.schoolUser.deleteMany();
    await prisma.school.deleteMany();
    await prisma.user.deleteMany();

    // Restore users
    console.log('\nRestoring users...');
    const userProgress = createProgressBar(backupData.users.length, 'Users');
    for (const userData of backupData.users) {
      const { schools, settings, ...userDataWithoutRelations } = userData;
      await prisma.user.create({
        data: userDataWithoutRelations
      });
      userProgress.increment();
    }
    userProgress.complete();

    // Restore schools
    console.log('\nRestoring schools...');
    const schoolProgress = createProgressBar(backupData.schools.length, 'Schools');
    for (const schoolData of backupData.schools) {
      const { users, settings, moods, ...schoolDataWithoutRelations } = schoolData;
      await prisma.school.create({
        data: schoolDataWithoutRelations
      });
      schoolProgress.increment();
    }
    schoolProgress.complete();

    // Restore school-user relationships
    console.log('\nRestoring school-user relationships...');
    const schoolUserProgress = createProgressBar(backupData.schoolUsers.length, 'School Users');
    for (const schoolUser of backupData.schoolUsers) {
      const { id, userId, schoolId, role, isPreferred, createdAt, updatedAt } = schoolUser;
      await prisma.schoolUser.create({
        data: {
          id,
          role,
          isPreferred,
          createdAt,
          updatedAt,
          user: { connect: { id: userId } },
          school: { connect: { id: schoolId } }
        }
      });
      schoolUserProgress.increment();
    }
    schoolUserProgress.complete();

    // Restore settings and moods with progress bars
    const settingsProgress = createProgressBar(backupData.userSettings.length, 'User Settings');
    console.log('\nRestoring user settings...');
    for (const settings of backupData.userSettings) {
      const { userId, ...settingsData } = settings;
      await prisma.userSettings.create({
        data: {
          ...settingsData,
          user: { connect: { id: userId } }
        }
      });
      settingsProgress.increment();
    }
    settingsProgress.complete();

    const schoolSettingsProgress = createProgressBar(backupData.schoolSettings.length, 'School Settings');
    console.log('\nRestoring school settings...');
    for (const settings of backupData.schoolSettings) {
      const { schoolId, ...settingsData } = settings;
      await prisma.schoolSettings.create({
        data: {
          ...settingsData,
          school: { connect: { id: schoolId } }
        }
      });
      schoolSettingsProgress.increment();
    }
    schoolSettingsProgress.complete();

    const moodProgress = createProgressBar(backupData.moods.length, 'Moods');
    console.log('\nRestoring moods...');
    for (const mood of backupData.moods) {
      const { schoolId, ...moodData } = mood;
      await prisma.mood.create({
        data: {
          ...moodData,
          school: { connect: { id: schoolId } }
        }
      });
      moodProgress.increment();
    }
    moodProgress.complete();

    console.log('\n✅ Restore completed successfully!\n');

    // Print final summary
    const summary = {
      users: await prisma.user.count(),
      schools: await prisma.school.count(),
      schoolUsers: await prisma.schoolUser.count(),
      moods: await prisma.mood.count(),
      userSettings: await prisma.userSettings.count(),
      schoolSettings: await prisma.schoolSettings.count(),
    };

    console.log('Final Database State:');
    console.table(summary);

  } catch (error) {
    console.error('\n❌ Restore failed:', error);
    if (error.code === 'P2002') {
      console.error('Unique constraint violation. Check for duplicate entries in the backup data.');
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Check for backup file argument
if (process.argv.length < 3) {
  console.error('Please provide backup file name');
  console.error('Usage: npx ts-node prisma/scripts/restore-db.mjs <backup-filename>');
  process.exit(1);
}

restoreBackup(process.argv[2]);