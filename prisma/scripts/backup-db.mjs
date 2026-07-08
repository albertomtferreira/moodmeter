// scripts/backup-db.ts
// npx ts-node prisma/scripts/backup-db.mjs
import { PrismaClient } from '@prisma/client';
import { mkdir, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getConnectionCandidates() {
  const candidates = [
    ['BACKUP_DATABASE_URL', process.env.BACKUP_DATABASE_URL],
    ['POSTGRES_URL_NON_POOLING', process.env.POSTGRES_URL_NON_POOLING],
    ['POSTGRES_PRISMA_URL', process.env.POSTGRES_PRISMA_URL],
    ['DATABASE_URL_UNPOOLED', process.env.DATABASE_URL_UNPOOLED],
    ['DATABASE_URL', process.env.DATABASE_URL],
    ['POSTGRES_URL', process.env.POSTGRES_URL]
  ];

  const seen = new Set();
  return candidates
    .filter(([, url]) => Boolean(url))
    .filter(([, url]) => {
      if (seen.has(url)) return false;
      seen.add(url);
      return true;
    });
}

function describeConnection(name, connectionUrl) {
  try {
    const parsed = new URL(connectionUrl);
    return `${name} (${parsed.hostname}:${parsed.port || '5432'})`;
  } catch {
    return name;
  }
}

function getBackupUrl(connectionUrl) {
  const parsed = new URL(connectionUrl);

  if (parsed.protocol.startsWith('postgres')) {
    parsed.searchParams.set('sslmode', parsed.searchParams.get('sslmode') || 'require');
    parsed.searchParams.set('connect_timeout', parsed.searchParams.get('connect_timeout') || '30');
    parsed.searchParams.set('pool_timeout', parsed.searchParams.get('pool_timeout') || '60');
    parsed.searchParams.set('connection_limit', parsed.searchParams.get('connection_limit') || '1');
  }

  return parsed.toString();
}

async function createBackup(prisma) {
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
      pwaInstallationEvents: await prisma.pWAInstallationEvent.findMany()
    };

    // Create backup file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, '../backups');
    await mkdir(backupDir, { recursive: true });
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
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const candidates = getConnectionCandidates();

  if (candidates.length === 0) {
    console.error('Backup failed: no database connection URL was found in the environment.');
    process.exit(1);
  }

  let lastError;

  for (const [name, connectionUrl] of candidates) {
    const connectionLabel = describeConnection(name, connectionUrl);
    console.log(`Trying backup connection: ${connectionLabel}`);
    const backupUrl = getBackupUrl(connectionUrl);

    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: backupUrl
        }
      }
    });

    try {
      await createBackup(prisma);
      return;
    } catch (error) {
      lastError = error;
      console.error(`Backup attempt failed for ${connectionLabel}:`, error.message);
    }
  }

  console.error('Backup failed: all configured database URLs failed.');
  if (lastError) {
    console.error(lastError);
  }
  process.exit(1);
}

main();
