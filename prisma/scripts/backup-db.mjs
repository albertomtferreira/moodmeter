// scripts/backup-db.ts
// npx ts-node prisma/scripts/backup-db.mjs
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function createBackup() {
  try {
    console.log('Starting backup...');
    
    // Fetch all data
    const data = {
      users: await prisma.user.findMany({
        include: {
          settings: true,
          schools: true
        }
      }),
      schools: await prisma.school.findMany({
        include: {
          settings: true,
          moods: true
        }
      }),
      schoolUsers: await prisma.schoolUser.findMany(),
      moods: await prisma.mood.findMany(),
      userSettings: await prisma.userSettings.findMany(),
      schoolSettings: await prisma.schoolSettings.findMany(),
      // pwaInstallationEvents: await prisma.pWAInstallationEvent.findMany()
    };

    // Create backup file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, '../backups');
    const filepath = path.join(backupDir, `backup-${timestamp}.json`);

    // Save to file
    await writeFile(filepath, JSON.stringify(data, null, 2));
    
    console.log(`Backup created successfully at: ${filepath}`);

    // Optional: Create a backup summary
    const summary = {
      timestamp: new Date().toISOString(),
      counts: {
        users: data.users.length,
        schools: data.schools.length,
        schoolUsers: data.schoolUsers.length,
        moods: data.moods.length,
        userSettings: data.userSettings.length,
        schoolSettings: data.schoolSettings.length,
        pwaInstallationEvents: data.pwaInstallationEvents.length
      }
    };

    console.log('\nBackup Summary:');
    console.table(summary.counts);

  } catch (error) {
    console.error('Backup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createBackup();