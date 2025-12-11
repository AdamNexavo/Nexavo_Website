#!/usr/bin/env node

// Script om backup logs te bekijken
// Gebruik: npm run backup:logs [--tail] [--lines N]

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import logger from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const LOG_FILE = logger.getLogPath();
const args = process.argv.slice(2);
const tailMode = args.includes('--tail');
const linesArg = args.find(arg => arg.startsWith('--lines='));
const lines = linesArg ? parseInt(linesArg.split('=')[1]) : 50;

if (!existsSync(LOG_FILE)) {
  console.log('ℹ️  Geen log bestand gevonden. Er zijn nog geen backups uitgevoerd.');
  process.exit(0);
}

try {
  const logContent = readFileSync(LOG_FILE, 'utf-8');
  const logLines = logContent.split('\n').filter(line => line.trim());
  
  if (tailMode) {
    // Toon laatste N regels
    const tailLines = logLines.slice(-lines);
    console.log(`\n📋 Laatste ${tailLines.length} log entries:\n`);
    tailLines.forEach(line => console.log(line));
  } else {
    // Toon alle logs
    console.log(`\n📋 Alle backup logs (${logLines.length} entries):\n`);
    logLines.forEach(line => console.log(line));
  }
  
  console.log(`\n📁 Log bestand: ${LOG_FILE}`);
  console.log(`📊 Totaal aantal entries: ${logLines.length}\n`);
} catch (error) {
  console.error('❌ Fout bij lezen van logs:', error.message);
  process.exit(1);
}
