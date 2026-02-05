#!/usr/bin/env node

/**
 * Script de configuration initiale du déploiement
 * Configure les projets Vercel et Railway de manière interactive
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function exec(command, options = {}) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'inherit', ...options });
  } catch (error) {
    return null;
  }
}

async function main() {
  log('\n╔═══════════════════════════════════════════╗', 'blue');
  log('║   Configuration du Déploiement           ║', 'blue');
  log('╚═══════════════════════════════════════════╝\n', 'blue');

  // Vérification des CLI
  log('📋 Vérification des outils...', 'yellow');
  
  const hasVercel = exec('which vercel', { stdio: 'pipe' });
  const hasRailway = exec('which railway', { stdio: 'pipe' });

  if (!hasVercel) {
    log('❌ Vercel CLI non installé', 'red');
    const install = await question('Installer Vercel CLI ? (o/n): ');
    if (install.toLowerCase() === 'o') {
      log('Installation de Vercel CLI...', 'yellow');
      exec('npm install -g vercel');
    } else {
      log('Installation annulée', 'red');
      process.exit(1);
    }
  }

  if (!hasRailway) {
    log('❌ Railway CLI non installé', 'red');
    const install = await question('Installer Railway CLI ? (o/n): ');
    if (install.toLowerCase() === 'o') {
      log('Installation de Railway CLI...', 'yellow');
      exec('npm install -g @railway/cli');
    } else {
      log('Installation annulée', 'red');
      process.exit(1);
    }
  }

  log('✅ Tous les outils sont installés\n', 'green');

  // Configuration Vercel
  log('🌐 Configuration Vercel (Frontend)', 'blue');
  const setupVercel = await question('Configurer le projet Vercel ? (o/n): ');
  
  if (setupVercel.toLowerCase() === 'o') {
    log('Connexion à Vercel...', 'yellow');
    exec('vercel login');
    
    log('Configuration du projet...', 'yellow');
    process.chdir('apps/web');
    exec('vercel link');
    process.chdir('../..');
    
    log('✅ Vercel configuré\n', 'green');
  }

  // Configuration Railway
  log('🚂 Configuration Railway (Backend)', 'blue');
  const setupRailway = await question('Configurer le projet Railway ? (o/n): ');
  
  if (setupRailway.toLowerCase() === 'o') {
    log('Connexion à Railway (browserless)...', 'yellow');
    exec('railway login --browserless');
    
    log('Initialisation du projet...', 'yellow');
    exec('railway init');
    
    const addDb = await question('Ajouter une base de données PostgreSQL ? (o/n): ');
    if (addDb.toLowerCase() === 'o') {
      log('Ajout de PostgreSQL...', 'yellow');
      exec('railway add postgresql');
    }
    
    log('✅ Railway configuré\n', 'green');
  }

  // Variables d'environnement
  log('🔐 Configuration des variables d\'environnement', 'blue');
  const setupEnv = await question('Voulez-vous configurer les variables maintenant ? (o/n): ');
  
  if (setupEnv.toLowerCase() === 'o') {
    log('\n📝 Variables pour le Backend (Railway):', 'yellow');
    log('Ouvrez: https://railway.app → Votre projet → Variables', 'blue');
    log('Ajoutez:', 'yellow');
    log('  - DATABASE_URL (automatique si PostgreSQL ajouté)');
    log('  - JWT_SECRET (généré aléatoirement)');
    log('  - DISCORD_CLIENT_ID');
    log('  - DISCORD_CLIENT_SECRET');
    log('  - DISCORD_BOT_TOKEN');
    
    log('\n📝 Variables pour le Frontend (Vercel):', 'yellow');
    log('Ouvrez: https://vercel.com → Votre projet → Settings → Environment Variables', 'blue');
    log('Ajoutez:', 'yellow');
    log('  - NEXT_PUBLIC_API_URL (URL de votre API Railway)');
    log('  - NEXT_PUBLIC_WS_URL (URL WebSocket Railway)');
    
    await question('\nAppuyez sur Entrée quand c\'est fait...');
  }

  // Résumé
  log('\n╔═══════════════════════════════════════════╗', 'green');
  log('║       Configuration Terminée !            ║', 'green');
  log('╚═══════════════════════════════════════════╝\n', 'green');

  log('📚 Commandes disponibles:', 'blue');
  log('  • npm run deploy:prod    - Déploiement production');
  log('  • npm run deploy:preview - Déploiement preview');
  log('  • npm run deploy         - Déploiement interactif');
  log('  • ./scripts/deploy.sh    - Script bash complet\n');

  log('🎉 Vous pouvez maintenant déployer votre application !', 'green');
  
  rl.close();
}

main().catch(error => {
  log(`\n❌ Erreur: ${error.message}`, 'red');
  process.exit(1);
});
