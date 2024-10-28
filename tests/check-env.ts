// scripts/check-env.ts
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env') });

console.log('Environment Variables Check:');
console.log('--------------------------');
console.log('WEBHOOK_SECRET:', process.env.WEBHOOK_SECRET ? '✅ Present' : '❌ Missing');
console.log('WEBHOOK_SECRET:', process.env.WEBHOOK_SECRET);
console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set');
console.log('Current Directory:', __dirname);
console.log('Env File Path:', resolve(__dirname, '../.env'));