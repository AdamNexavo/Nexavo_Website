#!/usr/bin/env node

// Auto backup script voor GitHub
// Dit script commit en pusht automatisch alle wijzigingen
// Gebruikt GitHub CLI (gh) voor veilige authenticatie

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';
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

// Functie om GIT_LOG.md bij te werken
function updateGitLog(commitHash, commitMessage, author, email, date) {
  try {
    const gitLogPath = join(projectRoot, 'GIT_LOG.md');
    
    // Haal commit informatie op als niet meegegeven
    let hash = commitHash;
    let message = commitMessage;
    let commitAuthor = author;
    let commitEmail = email;
    let commitDate = date;
    
    if (!hash || !message || !commitAuthor || !commitEmail || !commitDate) {
      try {
        hash = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
        const logEntry = execSync(`git log -1 --pretty=format:"%H|%an|%ae|%ad|%s" --date=iso ${hash}`, { 
          encoding: 'utf-8' 
        }).trim();
        const [fullHash, name, mail, dateStr, msg] = logEntry.split('|');
        hash = fullHash;
        message = message || msg;
        commitAuthor = commitAuthor || name;
        commitEmail = commitEmail || mail;
        commitDate = commitDate || dateStr;
      } catch (error) {
        logger.warn('Kon commit info niet ophalen voor GIT_LOG.md', { error: error.message });
        return;
      }
    }
    
    // Lees huidige GIT_LOG.md of maak nieuwe
    let content = '';
    if (existsSync(gitLogPath)) {
      content = readFileSync(gitLogPath, 'utf-8');
    } else {
      content = `# Git Commit Log

Dit bestand bevat de volledige git commit geschiedenis van dit project.

Laatste update: ${new Date().toLocaleString('nl-NL')}

## Commit Overzicht (Grafisch)

\`\`\`
`;

      // Voeg git log graph toe
      try {
        const graph = execSync('git log --oneline --graph --all --decorate -20', { encoding: 'utf-8' }).trim();
        content += graph + '\n```\n\n';
      } catch {
        content += '* Geen commits gevonden\n```\n\n';
      }

      content += `## Gedetailleerde Commit Geschiedenis

| Hash | Auteur | Email | Datum | Bericht |
|------|--------|-------|-------|---------|
`;

      // Voeg git log toe
      try {
        const logEntries = execSync('git log --pretty=format:"%H|%an|%ae|%ad|%s" --date=iso -20', { encoding: 'utf-8' })
          .trim()
          .split('\n')
          .filter(l => l.trim());
        
        logEntries.forEach(line => {
          const [hash, name, mail, dateStr, msg] = line.split('|');
          content += `| ${hash.substring(0, 7)} | ${name} | ${mail} | ${dateStr} | ${msg} |\n`;
        });
      } catch {
        // Geen entries
      }

      content += `\n## Volledige Log (CSV formaat)

\`\`\`
Hash|Auteur|Email|Datum|Bericht
`;

      // Voeg CSV entries toe
      try {
        const csvEntries = execSync('git log --pretty=format:"%H|%an|%ae|%ad|%s" --date=iso -20', { encoding: 'utf-8' })
          .trim()
          .split('\n')
          .filter(l => l.trim());
        
        csvEntries.forEach(line => {
          content += line + '\n';
        });
      } catch {
        // Geen entries
      }

      content += `\`\`\`

---

## Backup Logs

`;
    }

    // Voeg nieuwe backup log entry toe aan het einde
    const logEntry = `### ${new Date().toLocaleString('nl-NL')} - ${commitMessage}

- **Commit Hash**: ${hash.substring(0, 7)}
- **Auteur**: ${commitAuthor} (${commitEmail})
- **Datum**: ${commitDate}
- **Status**: ✅ Gepusht naar GitHub

---

`;

    // Voeg entry toe aan het einde, vóór de laatste regel
    if (content.includes('## Backup Logs')) {
      // Voeg toe na "## Backup Logs"
      const backupLogsIndex = content.indexOf('## Backup Logs') + '## Backup Logs'.length;
      const beforeBackup = content.substring(0, backupLogsIndex);
      const afterBackup = content.substring(backupLogsIndex);
      content = beforeBackup + '\n\n' + logEntry + afterBackup;
    } else {
      // Voeg nieuwe sectie toe
      content += logEntry;
    }

    // Update laatste update timestamp bovenaan
    const updatePattern = /Laatste update: .*/;
    if (updatePattern.test(content)) {
      content = content.replace(updatePattern, `Laatste update: ${new Date().toLocaleString('nl-NL')}`);
    }

    // Update de grafische weergave
    try {
      const graph = execSync('git log --oneline --graph --all --decorate -20', { encoding: 'utf-8' }).trim();
      const graphPattern = /```[\s\S]*?```/;
      const graphMatch = content.match(/## Commit Overzicht \(Grafisch\)\s+```/);
      if (graphMatch) {
        const start = content.indexOf('## Commit Overzicht (Grafisch)');
        const end = content.indexOf('```', start) + 3;
        const newGraph = `## Commit Overzicht (Grafisch)

\`\`\`
${graph}
\`\`\`
`;
        content = content.substring(0, start) + newGraph + content.substring(content.indexOf('\n', end));
      }
    } catch (error) {
      logger.debug('Kon git graph niet updaten in GIT_LOG.md', { error: error.message });
    }

    // Update de tabel
    try {
      const logEntries = execSync('git log --pretty=format:"%H|%an|%ae|%ad|%s" --date=iso -20', { encoding: 'utf-8' })
        .trim()
        .split('\n')
        .filter(l => l.trim());
      
      const tableStart = content.indexOf('| Hash | Auteur |');
      const tableEnd = content.indexOf('\n\n', tableStart);
      if (tableStart !== -1 && tableEnd !== -1) {
        const beforeTable = content.substring(0, tableStart);
        const afterTable = content.substring(tableEnd);
        let newTable = `| Hash | Auteur | Email | Datum | Bericht |\n|------|--------|-------|-------|---------|\n`;
        
        logEntries.forEach(line => {
          const [hash, name, mail, dateStr, msg] = line.split('|');
          newTable += `| ${hash.substring(0, 7)} | ${name} | ${mail} | ${dateStr} | ${msg} |\n`;
        });
        
        content = beforeTable + newTable + afterTable;
      }
    } catch (error) {
      logger.debug('Kon tabel niet updaten in GIT_LOG.md', { error: error.message });
    }

    // Schrijf bijgewerkt bestand
    writeFileSync(gitLogPath, content, 'utf-8');
    logger.debug('GIT_LOG.md bijgewerkt met nieuwe backup entry', { commitHash: hash.substring(0, 7) });
  } catch (error) {
    logger.warn('Kon GIT_LOG.md niet bijwerken', { error: error.message });
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
  logger.info('🚀 Backup proces gestart');
  logger.info('─────────────────────────────────────────');
  
  // Check of er wijzigingen zijn
  const status = execSync('git status --porcelain', { encoding: 'utf-8' });
  
  if (status.trim()) {
    const changedFiles = status.trim().split('\n').length;
    const changedFileList = status.trim().split('\n').map(line => {
      const file = line.substring(3).trim();
      const status = line.substring(0, 2).trim();
      return `${status} ${file}`;
    }).slice(0, 5); // Toon max 5 bestanden
    
    logger.info(`📋 Wijzigingen gedetecteerd: ${changedFiles} bestand(en)`);
    if (changedFileList.length > 0) {
      logger.debug(`Bestanden: ${changedFileList.join(', ')}${changedFiles > 5 ? '...' : ''}`);
    }
    
    // Voeg alle wijzigingen toe
    logger.debug('📦 Wijzigingen toevoegen aan staging area...');
    execSync('git add .', { stdio: 'pipe' });
    logger.debug('✅ Alle wijzigingen toegevoegd aan staging area');
    
    // Maak een commit met timestamp
    const timestamp = new Date().toLocaleString('nl-NL', { 
      dateStyle: 'short', 
      timeStyle: 'medium' 
    });
    const commitMessage = `Auto backup: ${timestamp}`;
    logger.info(`📝 Committen van ${changedFiles} bestand(en)...`);
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'pipe' });
    const commitHash = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
    logger.success(`✅ Commit gemaakt: ${commitHash.substring(0, 7)} - ${commitMessage}`, { 
      commitHash: commitHash.substring(0, 7), 
      commitMessage,
      fileCount: changedFiles
    });
    
    // Push naar GitHub
    const branch = getCurrentBranch();
    logger.debug(`Branch gedetecteerd: ${branch}`, { branch });
    
    // Push naar GitHub
    logger.info(`🔄 Starten met pushen naar GitHub (branch: ${branch})...`);
    let pushSuccess = false;
    let pushError = null;
    
    if (checkGhCLI()) {
      logger.debug('GitHub CLI beschikbaar, gebruik voor authenticatie');
      try {
        // Probeer eerst met gh auth refresh om token te vernieuwen
        execSync('gh auth refresh -h github.com -s write:packages 2>/dev/null || true', { stdio: 'ignore' });
        logger.debug('Authenticatie met GitHub CLI...');
        const pushOutput = execSync(`git push origin ${branch}`, { encoding: 'utf-8', stdio: 'pipe' });
        const pushLines = pushOutput.trim().split('\n').filter(l => l.trim());
        logger.info(`✅ Push succesvol! Commit hash: ${commitHash.substring(0, 7)}`);
        if (pushLines.length > 0) {
          logger.debug(`Push details: ${pushLines.join(' | ')}`);
        }
        logger.success(`✨ Backup compleet: Commit gepusht naar GitHub (${branch})`, { 
          commitHash: commitHash.substring(0, 7), 
          branch, 
          timestamp 
        });
        pushSuccess = true;
      } catch (error) {
        pushError = error;
        logger.warn(`⚠️  GitHub CLI push gefaald: ${error.message}`);
        logger.info('🔄 Probeer normale git push als fallback...');
        try {
          // Fallback naar normale git push
          const pushOutput = execSync(`git push origin ${branch}`, { encoding: 'utf-8', stdio: 'pipe' });
          const pushLines = pushOutput.trim().split('\n').filter(l => l.trim());
          logger.info(`✅ Push succesvol (fallback)! Commit hash: ${commitHash.substring(0, 7)}`);
          if (pushLines.length > 0) {
            logger.debug(`Push details: ${pushLines.join(' | ')}`);
          }
          logger.success(`✨ Backup compleet: Commit gepusht naar GitHub (${branch})`, { 
            commitHash: commitHash.substring(0, 7), 
            branch, 
            timestamp 
          });
          pushSuccess = true;
          
          // Update GIT_LOG.md
          try {
            const commitInfo = execSync(`git log -1 --pretty=format:"%an|%ae|%ad" --date=iso ${commitHash}`, { 
              encoding: 'utf-8' 
            }).trim().split('|');
            updateGitLog(commitHash, commitMessage, commitInfo[0], commitInfo[1], commitInfo[2]);
          } catch (error) {
            logger.debug('Kon commit info niet ophalen voor GIT_LOG.md update', { error: error.message });
          }
        } catch (fallbackError) {
          pushError = fallbackError;
          const errorMsg = fallbackError.stderr?.toString() || fallbackError.message;
          logger.error(`❌ Push gefaald na alle pogingen: ${errorMsg}`, fallbackError);
        }
      }
    } else {
      logger.debug('GitHub CLI niet beschikbaar, gebruik normale git push');
      try {
        logger.info('Authenticatie met git credentials...');
        const pushOutput = execSync(`git push origin ${branch}`, { encoding: 'utf-8', stdio: 'pipe' });
        const pushLines = pushOutput.trim().split('\n').filter(l => l.trim());
        logger.info(`✅ Push succesvol! Commit hash: ${commitHash.substring(0, 7)}`);
        if (pushLines.length > 0) {
          logger.debug(`Push details: ${pushLines.join(' | ')}`);
        }
        logger.success(`✨ Backup compleet: Commit gepusht naar GitHub (${branch})`, { 
          commitHash: commitHash.substring(0, 7), 
          branch, 
          timestamp 
        });
        pushSuccess = true;
        
        // Update GIT_LOG.md
        try {
          const commitInfo = execSync(`git log -1 --pretty=format:"%an|%ae|%ad" --date=iso ${commitHash}`, { 
            encoding: 'utf-8' 
          }).trim().split('|');
          updateGitLog(commitHash, commitMessage, commitInfo[0], commitInfo[1], commitInfo[2]);
        } catch (error) {
          logger.debug('Kon commit info niet ophalen voor GIT_LOG.md update', { error: error.message });
        }
      } catch (error) {
        pushError = error;
        const errorMsg = error.stderr?.toString() || error.message;
        logger.error(`❌ Push gefaald: ${errorMsg}`, error);
      }
    }
    
    if (!pushSuccess) {
      logger.warn(`⚠️  Push naar GitHub is niet gelukt. Commit ${commitHash.substring(0, 7)} is wel lokaal gemaakt.`, { 
        branch, 
        commitHash: commitHash.substring(0, 7),
        error: pushError?.message 
      });
      logger.info('💡 Tip: Push handmatig met: git push origin main');
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
    logger.info('ℹ️  Geen wijzigingen om te backuppen - alles is up-to-date');
  }
} catch (error) {
  logger.error('Fout bij backup', error);
  process.exit(1);
}
