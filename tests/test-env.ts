// test-env.ts
const dotenv = require('dotenv');
const path = require('path');
import { prisma } from '../lib/prisma';

// Load the env file
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('Environment Variables Test');
console.log('=========================');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Found ✅' : 'Not found ❌');
console.log('Current working directory:', process.cwd());
console.log('Env file location:', path.join(__dirname, '.env'));

// Test database connection
async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Database connection successful! ✅');
    await prisma.$disconnect();
  } catch (error) {
    console.error('Database connection failed! ❌');
    console.error(error);
  }
}

testConnection();