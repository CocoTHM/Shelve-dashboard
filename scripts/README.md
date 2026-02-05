# 🚀 Scripts de Déploiement Automatisé

Ce dossier contient les scripts pour automatiser le déploiement sur Vercel (frontend) et Railway (backend).

## 📦 Scripts Disponibles

### Configuration Initiale

```bash
# Configuration interactive des projets Vercel et Railway
npm run deploy:setup
```

Ce script vous guide à travers :
- Installation des CLI Vercel et Railway
- Connexion aux services
- Configuration des projets
- Création de la base de données PostgreSQL

### Déploiement

```bash
# Déploiement interactif (choisir frontend/backend/les deux)
npm run deploy

# Déploiement rapide en production
npm run deploy:prod

# Déploiement preview/staging
npm run deploy:preview
```

### Scripts Bash (alternative)

```bash
# Script complet avec menu interactif
./scripts/deploy.sh

# Déploiement direct en production
./scripts/deploy-prod.sh

# Déploiement preview
./scripts/deploy-preview.sh
```

## � Authentification Railway

Railway CLI utilise l'authentification sans navigateur (browserless) :

```bash
# Connexion guidée Railway
npm run railway:login

# OU directement
railway login --browserless
```

Le script affichera un lien à ouvrir dans votre navigateur pour autoriser la CLI.

### Token Railway pour CI/CD

```bash
# Guide pour générer un token Railway
npm run railway:token
```

Suivez les instructions pour :
1. Créer un token sur https://railway.app/account/tokens
2. L'ajouter à vos GitHub Secrets (RAILWAY_TOKEN)

## �🔧 Configuration Requise

### Variables d'Environnement - Backend (Railway)

Ajoutez dans Railway Dashboard :

```env
DATABASE_URL=postgresql://...  # Automatique si PostgreSQL ajouté
JWT_SECRET=votre_secret_jwt_aleatoire
DISCORD_CLIENT_ID=votre_client_id
DISCORD_CLIENT_SECRET=votre_client_secret
DISCORD_BOT_TOKEN=votre_bot_token
NODE_ENV=production
PORT=3001
```

### Variables d'Environnement - Frontend (Vercel)

Ajoutez dans Vercel Dashboard :

```env
NEXT_PUBLIC_API_URL=https://votre-api.railway.app/api
NEXT_PUBLIC_WS_URL=https://votre-api.railway.app
```

## 🤖 Déploiement Automatique via GitHub Actions

Deux workflows sont configurés dans [`.github/workflows/`](../.github/workflows/) :

### `deploy.yml` - Production

Déclenché automatiquement sur chaque push vers `main` :
- Déploie le backend sur Railway
- Déploie le frontend sur Vercel

Configuration requise dans GitHub Secrets :
```
RAILWAY_TOKEN
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

**Méthode recommandée :**

```bash
npm run railway:token
```

**Ou manuellement :**

1. Allez sur https://railway.app/account/tokens
2. Créez un nouveau token
3. Copiez-le immédiatement (il ne sera plus visible)

**Pour l'authentification locale :**

```bash
railway login --browserless
# Suivez le lien affiché pour autoriserew sur Vercel
- Commente le PR avec le lien de preview

## 📝 Ordre des Opérations

Le déploiement suit cet ordre :

1. **Backend (Railway)** :
   - Installation des dépendances
   - Génération des clients Prisma
   - Build de l'application
   - Déploiement

2. **Frontend (Vercel)** :
   - Configuration des variables d'environnement
   - Build de l'application Next.js
   - Déploiement

## 🔐 Obtenir les Tokens

### Railway Token

```bash
railway login
railway whoami --json
# Copiez la valeur du token
```

### Vercel Token

1. Allez sur https://vercel.com/account/tokens
2. Créez un nouveau token
3. Copiez-le immédiatement (il ne sera plus visible)

### Vercel Project IDs

```bash
cd apps/web
vercel link
# Les IDs seront dans .vercel/project.json
```

## 🛠️ Commandes Utiles

### Railway

```bash
# Voir les logs
railway logs --service api

# Exécuter les migrations
railway run --service api npm run prisma:migrate

# Ouvrir Prisma Studio
railway run --service api npm run prisma:studio

# Variables d'environnement
railway variables
```

### Vercel

```bash
# Voir les logs
vercel logs

# Lister les déploiements
vercel list

# Variables d'environnement
vercel env ls
vercel env add NEXT_PUBLIC_API_URL
```

## 🐛 Dépannage

### Erreur : "Module not found: Can't resolve '@/components/ui/...'"

Les composants UI sont créés automatiquement. Si l'erreur persiste :

```bash
cd apps/web
npm install
npm run build
```

### Erreur de base de données sur Railway

```bash
# Vérifier la connexion
railway run --service api npm run prisma:migrate

# Réinitialiser la base de données (ATTENTION : efface les données)
railway run --service api npx prisma migrate reset
```

### Erreur Vercel : "Build Command Failed"

Vérifiez que les variables d'environnement sont définies dans Vercel Dashboard.

## 📚 Ressources

- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Railway](https://docs.railway.app)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation Next.js](https://nextjs.org/docs)
