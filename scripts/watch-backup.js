#!/usr/bin/env node

// Watch script die automatisch backup doet wanneer bestanden wijzigen
// Gebruikt chokidar voor betere file watching (fallback naar fs.watch)

import { execSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { watch } from 'fs';
import logger from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

process.chdir(projectRoot);

let backupTimeout;
const BACKUP_DELAY = 20000; // Wacht 20 seconden na laatste wijziging voordat backup wordt gedaan
const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  '.DS_Store',
  '*.log',
  '.vscode',
  '.idea'
];

let isBackingUp = false;

function doBackup() {
  if (isBackingUp) {
    logger.warn('Backup al bezig, wachten...');
    return;
  }
  
  isBackingUp = true;
  try {
    logger.info('Wijzigingen gedetecteerd, backup starten...');
    execSync('node scripts/auto-backup.js', { stdio: 'inherit' });
  } catch (error) {
    logger.error('Backup gefaald', error);
  } finally {
    isBackup = false;
  }
}

function scheduleBackup() {
  // Clear vorige timeout
  if (backupTimeout) {
    clearTimeout(backupTimeout);
  }
  
  // Schedule nieuwe backup
  backupTimeout = setTimeout(() => {
    doBackup();
  }, BACKUP_DELAY);
}

function shouldIgnore(path) {
  return IGNORE_PATTERNS.some(pattern => path.includes(pattern));
}

// Probeer chokidar te gebruiken (als geïnstalleerd), anders fallback naar fs.watch
let watcher;

(async () => {
  try {
    // Dynamisch importeren van chokidar
    const chokidar = await import('chokidar');
    
    logger.info('Watch mode gestart met chokidar', { backupDelay: BACKUP_DELAY });
    console.log('👀 Wachten op wijzigingen met chokidar...');
    console.log(`⏱️  Backup gebeurt automatisch ${BACKUP_DELAY / 1000} seconden na laatste wijziging`);
    console.log('Druk Ctrl+C om te stoppen\n');
    
    watcher = chokidar.watch([
      join(projectRoot, 'src'),
      join(projectRoot, 'public'),
      join(projectRoot, '*.{ts,tsx,js,jsx,json,md}'),
      join(projectRoot, '*.config.{ts,js}'),
    ], {
      ignored: (path) => shouldIgnore(path),
      ignoreInitial: true,
      persistent: true
    });
    
    watcher
      .on('change', (path) => {
        const relativePath = path.replace(projectRoot + '/', '');
        logger.debug(`Wijziging gedetecteerd: ${relativePath}`, { path: relativePath, type: 'change' });
        console.log(`📝 Wijziging gedetecteerd: ${relativePath}`);
        scheduleBackup();
      })
      .on('add', (path) => {
        const relativePath = path.replace(projectRoot + '/', '');
        logger.debug(`Bestand toegevoegd: ${relativePath}`, { path: relativePath, type: 'add' });
        console.log(`➕ Bestand toegevoegd: ${relativePath}`);
        scheduleBackup();
      })
      .on('unlink', (path) => {
        const relativePath = path.replace(projectRoot + '/', '');
        logger.debug(`Bestand verwijderd: ${relativePath}`, { path: relativePath, type: 'unlink' });
        console.log(`🗑️  Bestand verwijderd: ${relativePath}`);
        scheduleBackup();
      });
      
  } catch (error) {
    // Fallback naar fs.watch als chokidar niet beschikbaar is
    logger.warn('Watch mode gestart in fallback mode (chokidar niet beschikbaar)', { backupDelay: BACKUP_DELAY });
    console.log('👀 Wachten op wijzigingen (fallback mode)...');
    console.log(`⏱️  Backup gebeurt automatisch ${BACKUP_DELAY / 1000} seconden na laatste wijziging`);
    console.log('💡 Tip: Installeer chokidar voor betere performance: npm install -D chokidar');
    console.log('Druk Ctrl+C om te stoppen\n');
    
    // Watch de belangrijkste folders
    const watchDirs = [
      join(projectRoot, 'src'),
      join(projectRoot, 'public')
    ];
    
    watchDirs.forEach(dir => {
      try {
        watch(dir, { recursive: true }, (eventType, filename) => {
          if (filename && !shouldIgnore(filename)) {
            logger.debug(`Wijziging gedetecteerd: ${filename}`, { path: filename, type: eventType });
            console.log(`📝 Wijziging gedetecteerd: ${filename}`);
            scheduleBackup();
          }
        });
      } catch (err) {
        console.error(`❌ Kan ${dir} niet watch:`, err.message);
      }
    });
  }
})();

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('Backup watcher gestopt door gebruiker');
  console.log('\n\n🛑 Backup watcher gestopt');
  if (watcher) {
    watcher.close();
  }
  if (backupTimeout) {
    clearTimeout(backupTimeout);
  }
  process.exit(0);
});


