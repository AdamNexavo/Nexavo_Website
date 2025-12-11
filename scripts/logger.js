#!/usr/bin/env node

// Logger utility voor backup scripts
// Slaat logs op per project in een logs directory

import { existsSync, mkdirSync, appendFileSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Haal project naam op uit package.json of directory naam
function getProjectName() {
  try {
    const packageJsonPath = join(projectRoot, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    return packageJson?.name || 
           projectRoot.split('/').pop() || 
           'unknown-project';
  } catch {
    return projectRoot.split('/').pop() || 'unknown-project';
  }
}

// Logs directory per project
const LOGS_DIR = join(projectRoot, 'logs');
const LOG_FILE = join(LOGS_DIR, 'backup.log');

// Zorg dat logs directory bestaat
if (!existsSync(LOGS_DIR)) {
  mkdirSync(LOGS_DIR, { recursive: true });
}

// Functie om timestamp te maken
function getTimestamp() {
  return new Date().toISOString();
}

// Functie om log entry te formatteren
function formatLogEntry(level, message, data = null) {
  const timestamp = getTimestamp();
  const projectName = getProjectName();
  const readableTime = new Date(timestamp).toLocaleString('nl-NL', {
    dateStyle: 'short',
    timeStyle: 'medium'
  });
  
  // Basis log entry
  let entry = `[${readableTime}] [${level}] ${message}`;
  
  // Voeg data toe indien beschikbaar
  if (data && Object.keys(data).length > 0) {
    // Formatteer data leesbaar
    const dataStr = Object.entries(data)
      .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
      .join(', ');
    entry += ` | ${dataStr}`;
  }
  
  return entry;
}

// Logger object
export const logger = {
  // Info log
  info(message, data = null) {
    const entry = formatLogEntry('INFO', message, data);
    console.log(`ℹ️  ${message}`);
    appendFileSync(LOG_FILE, entry + '\n');
  },
  
  // Success log
  success(message, data = null) {
    const entry = formatLogEntry('SUCCESS', message, data);
    console.log(`✅ ${message}`);
    appendFileSync(LOG_FILE, entry + '\n');
  },
  
  // Warning log
  warn(message, data = null) {
    const entry = formatLogEntry('WARN', message, data);
    console.warn(`⚠️  ${message}`);
    appendFileSync(LOG_FILE, entry + '\n');
  },
  
  // Error log
  error(message, error = null) {
    const errorData = error ? {
      message: error.message,
      stack: error.stack
    } : null;
    const entry = formatLogEntry('ERROR', message, errorData);
    console.error(`❌ ${message}`);
    if (error) {
      console.error(error);
    }
    appendFileSync(LOG_FILE, entry + '\n');
  },
  
  // Debug log (alleen naar bestand, niet naar console, tenzij DEBUG mode)
  debug(message, data = null) {
    const entry = formatLogEntry('DEBUG', message, data);
    appendFileSync(LOG_FILE, entry + '\n');
    // Optioneel: toon debug logs in console als DEBUG env var is gezet
    if (process.env.DEBUG === 'true') {
      console.log(`🔍 [DEBUG] ${message}`);
    }
  },
  
  // Get log file path
  getLogPath() {
    return LOG_FILE;
  },
  
  // Get logs directory
  getLogsDir() {
    return LOGS_DIR;
  }
};

export default logger;
