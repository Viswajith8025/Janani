import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, '..');

const requiredFiles = [
  'vercel.json',
  'api/index.js',
  'backend/app.js',
  'backend/utils/envValidate.js'
];

let failed = false;

console.log('🔍 Running Deployment Verification...');

// 1. Verify files exist
requiredFiles.forEach(file => {
  if (!fs.existsSync(path.join(root, file))) {
    console.error(`❌ CRITICAL: Missing required file: ${file}`);
    failed = true;
  } else {
    console.log(`✅ Found: ${file}`);
  }
});

// 2. Verify ENV is safely ignored
const gitignore = fs.readFileSync(path.join(root, '.gitignore'), 'utf-8');
if (!gitignore.includes('.env')) {
  console.error('❌ CRITICAL: .env is NOT in .gitignore!');
  failed = true;
} else {
  console.log('✅ .env is safely ignored.');
}

if (failed) {
  console.error('\n🚨 DEPLOYMENT FAILED VALIDATION! DO NOT MERGE.');
  process.exit(1);
} else {
  console.log('\n🚀 ALL CHECKS PASSED. READY FOR VERCEL DEPLOYMENT.');
  process.exit(0);
}
