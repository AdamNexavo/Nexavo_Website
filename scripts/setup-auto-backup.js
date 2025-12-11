#!/usr/bin/env node

// Setup script voor automatische backups
// Dit script configureert Git hooks voor automatische backups

import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, chmodSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

process.chdir(projectRoot);

const GIT_HOOKS_DIR = join(projectRoot, '.git', 'hooks');
const POST_COMMIT_HOOK = join(GIT_HOOKS_DIR, 'post-commit');

function checkGitRepo() {
  if (!existsSync(join(projectRoot, '.git'))) {
    console.error('❌ Dit is geen Git repository. Initialiseer eerst Git: git init');
    process.exit(1);
  }
}

function createPostCommitHook() {
  // Maak hooks directory als die niet bestaat
  if (!existsSync(GIT_HOOKS_DIR)) {
    mkdirSync(GIT_HOOKS_DIR, { recursive: true });
  }
  
  const hookContent = `#!/bin/sh
# Auto backup hook - backup automatisch na elke commit
# Dit script wordt automatisch uitgevoerd na elke git commit

cd "$(dirname "$0")/../.."
node scripts/auto-backup.js
`;
  
  writeFileSync(POST_COMMIT_HOOK, hookContent);
  chmodSync(POST_COMMIT_HOOK, '755');
  console.log('✅ Post-commit hook geïnstalleerd');
}

function checkGhCLI() {
  try {
    execSync('gh --version', { stdio: 'ignore' });
    console.log('✅ GitHub CLI (gh) is geïnstalleerd');
    return true;
  } catch {
    console.log('⚠️  GitHub CLI (gh) niet gevonden');
    console.log('   Installeer het met: brew install gh (of zie https://cli.github.com)');
    console.log('   Of authenticatie met: gh auth login');
    return false;
  }
}

function checkGitRemote() {
  try {
    const remote = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
    console.log(`✅ Git remote gevonden: ${remote.replace(/https:\/\/[^@]+@/, 'https://')}`);
    return true;
  } catch {
    console.log('⚠️  Geen Git remote gevonden');
    console.log('   Voeg een remote toe met: git remote add origin <url>');
    return false;
  }
}

console.log('🚀 Auto-backup systeem configureren...\n');

checkGitRepo();
checkGhCLI();
checkGitRemote();
createPostCommitHook();

console.log('\n✅ Setup voltooid!');
console.log('\n📋 Wat is er geconfigureerd:');
console.log('   • Post-commit hook: automatische backup na elke commit');
console.log('   • Watch script: npm run backup:watch voor continue monitoring');
console.log('   • Handmatige backup: npm run backup');
console.log('   • Logging: logs worden opgeslagen in logs/backup.log');
console.log('\n💡 Tips:');
console.log('   • Start watch mode: npm run backup:watch');
console.log('   • Maak handmatig backup: npm run backup');
console.log('   • Bekijk logs: npm run backup:logs');
console.log('   • Bekijk laatste logs: npm run backup:logs:tail');
console.log('   • Backups gebeuren automatisch na elke git commit');
console.log(`\n📁 Logs worden opgeslagen in: ${join(projectRoot, 'logs', 'backup.log')}`);

