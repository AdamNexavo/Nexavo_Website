#!/usr/bin/env node

// Auto backup script voor GitHub
// Dit script commit en pusht automatisch alle wijzigingen
// Gebruikt GitHub CLI (gh) voor veilige authenticatie

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import logger from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

process.chdir(projectRoot);

// Functie om te checken of gh CLI beschikbaar is
function checkGhCLI() {
  try {
    execSync('gh --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Functie om remote URL te krijgen
function getRemoteUrl() {
  try {
    const url = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
    // Verwijder token uit URL als die erin zit (voor veiligheid)
    return url.replace(/https:\/\/[^@]+@/, 'https://');
  } catch {
    return null;
  }
}

// Functie om branch naam te krijgen
function getCurrentBranch() {
  try {
    return execSync('git branch --show-current', { encoding: 'utf-8' }).trim() || 'main';
  } catch {
    return 'main';
  }
}

// Functie om laatste tag te krijgen
function getLastTag() {
  try {
    const tags = execSync('git tag -l --sort=-version:refname', { encoding: 'utf-8' }).trim().split('\n');
    return tags[0] || null;
  } catch {
    return null;
  }
}

// Functie om nieuwe versie te genereren
function generateVersion(createRelease = false) {
  // Optie 1: Gebruik package.json versie en increment
  try {
    const packageJsonPath = join(projectRoot, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const currentVersion = packageJson.version || '0.0.0';
    
    // Als versie 0.0.0 is, start met 1.0.0
    if (currentVersion === '0.0.0') {
      return '1.0.0';
    }
    
    // Parse versie
    const parts = currentVersion.split('.').map(Number);
    
    if (createRelease) {
      // Major release: increment minor
      parts[1] = (parts[1] || 0) + 1;
      parts[2] = 0;
    } else {
      // Patch release: increment patch
      parts[2] = (parts[2] || 0) + 1;
    }
    
    return parts.join('.');
  } catch {
    // Fallback: gebruik datum-gebaseerde versie
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    return `${year}.${month}.${day}.${hour}${minute}`;
  }
}

// Functie om versie in package.json bij te werken
function updatePackageVersion(version) {
  try {
    const packageJsonPath = join(projectRoot, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    packageJson.version = version;
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    return true;
  } catch {
    return false;
  }
}

// Functie om tag aan te maken en te pushen
function createTag(version, commitHash) {
  try {
    const tagName = `v${version}`;
    // Check of tag al bestaat
    try {
      execSync(`git rev-parse -q --verify "refs/tags/${tagName}"`, { stdio: 'ignore' });
      logger.warn(`Tag ${tagName} bestaat al, overslaan`);
      return null;
    } catch {
      // Tag bestaat niet, maak aan
    }
    
    execSync(`git tag -a "${tagName}" -m "Version ${version}" ${commitHash}`, { stdio: 'inherit' });
    execSync(`git push origin "${tagName}"`, { stdio: 'inherit' });
    logger.success(`Tag ${tagName} aangemaakt en gepusht`, { version, tagName });
    return tagName;
  } catch (error) {
    logger.warn(`Kon tag niet aanmaken: ${error.message}`);
    return null;
  }
}

// Functie om GitHub release aan te maken
function createGitHubRelease(version, tagName) {
  if (!checkGhCLI()) {
    logger.debug('GitHub CLI niet beschikbaar, skip release creation');
    return false;
  }
  
  try {
    // Haal remote repo info op
    const remoteUrl = getRemoteUrl();
    if (!remoteUrl) {
      logger.warn('Kon remote URL niet bepalen, skip release creation');
      return false;
    }
    
    // Extract owner/repo van URL
    const match = remoteUrl.match(/github\.com[/:]([^/]+)\/([^/]+?)(?:\.git)?$/);
    if (!match) {
      logger.warn('Kon repo info niet extraheren, skip release creation');
      return false;
    }
    
    const [, owner, repo] = match;
    const releaseTitle = `Version ${version}`;
    const releaseNotes = `Automatische release van versie ${version}\n\nBackup gemaakt op: ${new Date().toLocaleString('nl-NL')}`;
    
    // Maak release aan via gh CLI
    execSync(
      `gh release create "${tagName}" --title "${releaseTitle}" --notes "${releaseNotes}" --repo ${owner}/${repo}`,
      { stdio: 'inherit' }
    );
    
    logger.success(`GitHub release aangemaakt voor ${tagName}`, { version, tagName, owner, repo });
    return true;
  } catch (error) {
    logger.warn(`Kon GitHub release niet aanmaken: ${error.message}`);
    return false;
  }
}

try {
  logger.info('Backup proces gestart');
  
  // Check of er wijzigingen zijn
  const status = execSync('git status --porcelain', { encoding: 'utf-8' });
  
  if (status.trim()) {
    const changedFiles = status.trim().split('\n').length;
    logger.info(`Wijzigingen gedetecteerd: ${changedFiles} bestand(en)`, { fileCount: changedFiles });
    
    // Voeg alle wijzigingen toe
    execSync('git add .', { stdio: 'inherit' });
    logger.debug('Alle wijzigingen toegevoegd aan staging area');
    
    // Maak een commit met timestamp
    const timestamp = new Date().toLocaleString('nl-NL', { 
      dateStyle: 'short', 
      timeStyle: 'medium' 
    });
    const commitMessage = `Auto backup: ${timestamp}`;
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    logger.debug('Commit gemaakt', { commitMessage });
    
    // Push naar GitHub
    const branch = getCurrentBranch();
    logger.debug('Branch gedetecteerd', { branch });
    
    // Haal commit hash op voor tag
    const commitHash = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
    
    // Gebruik gh CLI als beschikbaar, anders standaard git push
    if (checkGhCLI()) {
      logger.debug('GitHub CLI beschikbaar, gebruik voor authenticatie');
      try {
        // Probeer eerst met gh auth refresh om token te vernieuwen
        execSync('gh auth refresh -h github.com -s write:packages 2>/dev/null || true', { stdio: 'ignore' });
        execSync(`git push origin ${branch}`, { stdio: 'inherit' });
        logger.success(`Backup voltooid en gepusht naar ${branch}`, { timestamp, branch });
      } catch (error) {
        logger.warn('GitHub CLI authenticatie gefaald, probeer normale git push');
        // Fallback naar normale git push
        execSync(`git push origin ${branch}`, { stdio: 'inherit' });
        logger.success(`Backup voltooid en gepusht naar ${branch}`, { timestamp, branch });
      }
    } else {
      logger.debug('GitHub CLI niet beschikbaar, gebruik normale git push');
      // Fallback: gebruik normale git push (gebruiker moet credentials hebben)
      execSync(`git push origin ${branch}`, { stdio: 'inherit' });
      logger.success(`Backup voltooid en gepusht naar ${branch}`, { timestamp, branch });
    }
    
    // Maak versie tag aan (alleen als CREATE_RELEASE environment variable is gezet, of bij belangrijke wijzigingen)
    const shouldCreateRelease = process.env.CREATE_RELEASE === 'true' || 
                                process.env.AUTO_TAG === 'true' ||
                                changedFiles > 10; // Auto-tag bij >10 gewijzigde bestanden
    
    if (shouldCreateRelease) {
      const newVersion = generateVersion(shouldCreateRelease);
      const tagName = createTag(newVersion, commitHash);
      
      if (tagName && process.env.CREATE_RELEASE === 'true') {
        // Update package.json versie
        updatePackageVersion(newVersion);
        
        // Maak GitHub release aan
        createGitHubRelease(newVersion, tagName);
      }
    }
  } else {
    logger.info('Geen wijzigingen om te backuppen');
  }
} catch (error) {
  logger.error('Fout bij backup', error);
  process.exit(1);
}
