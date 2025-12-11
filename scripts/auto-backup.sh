#!/bin/bash

# Auto backup script voor GitHub
# Dit script commit en pusht automatisch alle wijzigingen

cd "$(dirname "$0")/.."

# Check of er wijzigingen zijn
if [ -n "$(git status --porcelain)" ]; then
    # Voeg alle wijzigingen toe
    git add .
    
    # Maak een commit met timestamp
    TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
    git commit -m "Auto backup: $TIMESTAMP"
    
    # Push naar GitHub
    git push origin main
    
    echo "✅ Backup voltooid: $TIMESTAMP"
else
    echo "ℹ️  Geen wijzigingen om te backuppen"
fi


