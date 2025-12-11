#!/usr/bin/env node

// Script om handmatig een release aan te maken
// Gebruik: npm run backup:release [--version 1.0.0] [--auto]

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import logger from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

process.chdir(projectRoot);

const args = process.argv.slice(2);
const versionArg = args.find(arg => arg.startsWith('--version='));
const requestedVersion = versionArg ? versionArg.split('=')[1] : null;
const autoMode = args.includes('--auto');

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
    return url.replace(/https:\/\/[^@]+@/, 'https://');
  } catch {
    return null;
  }
}

// Functie om versie te genereren
function generateVersion() {
  if (requestedVersion) {
    return requestedVersion;
  }
  
  try {
    const packageJsonPath = join(projectRoot, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const currentVersion = packageJson.version || '0.0.0';
    
    if (currentVersion === '0.0.0') {
      return '1.0.0';
    }
    
    const parts = currentVersion.split('.').map(Number);
    parts[1] = (parts[1] || 0) + 1;
    parts[2] = 0;
    return parts.join('.');
  } catch {
    const now = new Date();
    return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
  }
}

// Functie om versie in package.json bij te werken
function updatePackageVersion(version) {
  try {
    const packageJsonPath = join(projectRoot, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    packageJson.version = version;
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    logger.info(`Package.json versie bijgewerkt naar ${version}`);
    return true;
  } catch (error) {
    logger.error('Kon package.json niet updaten', error);
    return false;
  }
}

// Functie om tag aan te maken
function createTag(version) {
  const tagName = `v${version}`;
  
  // Check of tag al bestaat
  try {
    execSync(`git rev-parse -q --verify "refs/tags/${tagName}"`, { stdio: 'ignore' });
    logger.warn(`Tag ${tagName} bestaat al`);
    return null;
  } catch {
    // Tag bestaat niet, goed
  }
  
  try {
    execSync(`git tag -a "${tagName}" -m "Version ${version}"`, { stdio: 'inherit' });
    execSync(`git push origin "${tagName}"`, { stdio: 'inherit' });
    logger.success(`Tag ${tagName} aangemaakt en gepusht`);
    return tagName;
  } catch (error) {
    logger.error(`Kon tag niet aanmaken: ${error.message}`, error);
    return null;
  }
}

// Functie om GitHub release aan te maken
function createGitHubRelease(version, tagName) {
  if (!checkGhCLI()) {
    logger.error('GitHub CLI (gh) is niet geïnstalleerd. Installeer het eerst: brew install gh');
    return false;
  }
  
  try {
    const remoteUrl = getRemoteUrl();
    if (!remoteUrl) {
      logger.error('Kon remote URL niet bepalen');
      return false;
    }
    
    const match = remoteUrl.match(/github\.com[/:]([^/]+)\/([^/]+?)(?:\.git)?$/);
    if (!match) {
      logger.error('Kon repo info niet extraheren uit remote URL');
      return false;
    }
    
    const [, owner, repo] = match;
    const releaseTitle = `Version ${version}`;
    const releaseNotes = `Release versie ${version}\n\nGemaakt op: ${new Date().toLocaleString('nl-NL')}`;
    
    logger.info(`Maak GitHub release aan voor ${owner}/${repo}...`);
    execSync(
      `gh release create "${tagName}" --title "${releaseTitle}" --notes "${releaseNotes}" --repo ${owner}/${repo}`,
      { stdio: 'inherit' }
    );
    
    logger.success(`GitHub release aangemaakt: https://github.com/${owner}/${repo}/releases/tag/${tagName}`);
    return true;
  } catch (error) {
    logger.error(`Kon GitHub release niet aanmaken: ${error.message}`, error);
    return false;
  }
}

// Main functie
async function main() {
  logger.info('Release creation proces gestart');
  
  // Check of we op main/master branch zijn
  const branch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
  if (branch !== 'main' && branch !== 'master') {
    logger.warn(`Je bent op branch '${branch}', niet op main/master`);
    if (!autoMode) {
      logger.info('Gebruik --auto om door te gaan');
      process.exit(1);
    }
  }
  
  // Check of er uncommitted changes zijn
  const status = execSync('git status --porcelain', { encoding: 'utf-8' }).trim();
  if (status && !autoMode) {
    logger.warn('Er zijn uncommitted changes. Commit deze eerst of gebruik --auto');
    process.exit(1);
  }
  
  // Genereer versie
  const version = generateVersion();
  logger.info(`Gebruik versie: ${version}`);
  
  // Update package.json
  if (!updatePackageVersion(version)) {
    process.exit(1);
  }
  
  // Commit package.json wijziging als die er is
  if (status || requestedVersion) {
    try {
      execSync('git add package.json', { stdio: 'inherit' });
      execSync(`git commit -m "Bump version to ${version}"`, { stdio: 'inherit' });
      execSync('git push', { stdio: 'inherit' });
    } catch (error) {
      logger.warn('Kon package.json wijziging niet committen', error);
    }
  }
  
  // Maak tag aan
  const tagName = createTag(version);
  if (!tagName) {
    logger.error('Kon tag niet aanmaken');
    process.exit(1);
  }
  
  // Maak GitHub release aan
  if (createGitHubRelease(version, tagName)) {
    logger.success(`✅ Release ${version} succesvol aangemaakt!`);
    console.log(`\n🎉 Je release is beschikbaar op GitHub!`);
  } else {
    logger.warn('Tag is aangemaakt, maar GitHub release kon niet worden aangemaakt');
  }
}

main().catch(error => {
  logger.error('Fout bij release creation', error);
  process.exit(1);
});
