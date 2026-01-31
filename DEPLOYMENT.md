# 🚀 Guide de Déploiement

Ce guide explique comment déployer le Discord Dashboard en production.

## 📋 Architecture de Déploiement

- **Frontend (Next.js)** → Vercel
- **Backend (NestJS) + Bot Discord** → Railway / Render / Heroku
- **Base de données PostgreSQL** → Railway / Supabase / Neon

## 🌐 Déploiement Frontend sur Vercel

### 1. Préparation du Projet

Assurez-vous que le build fonctionne localement :
```bash
cd apps/web
npm run build
```

### 2. Déploiement via Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer (à la racine du projet)
vercel

# Déploiement en production
vercel --prod
```

### 3. Configuration des Variables d'Environnement

Dans le dashboard Vercel (Settings → Environment Variables) :

```env
# URL de votre API backend (voir section Backend)
NEXT_PUBLIC_API_URL=https://votre-api.railway.app/api

# URL WebSocket
NEXT_PUBLIC_WS_URL=https://votre-api.railway.app

# Node environment
NODE_ENV=production
```

### 4. Déploiement via GitHub (Recommandé)

1. Pushez votre code sur GitHub
2. Allez sur https://vercel.com/new
3. Importez votre repository
4. Configurez :
   - **Root Directory** : laissez vide ou mettez `apps/web`
   - **Build Command** : `cd apps/web && npm install && npm run build`
   - **Output Directory** : `apps/web/.next`
   - **Install Command** : `npm install --prefix apps/web`
5. Ajoutez les variables d'environnement
6. Cliquez sur "Deploy"

## 🖥️ Déploiement Backend sur Railway

### Option 1 : Via Railway CLI

```bash
# Installer Railway CLI
npm i -g @railway/cli

# Se connecter
railway login

# Initialiser le projet
railway init

# Créer PostgreSQL
railway add postgresql

# Déployer
railway up

# Obtenir l'URL de l'API
railway domain
```

### Option 2 : Via GitHub (Recommandé)

1. Créez un compte sur https://railway.app
2. Cliquez sur "New Project" → "Deploy from GitHub repo"
3. Sélectionnez votre repository
4. Configurez :
   - **Root Directory** : `apps/api`
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm run start:prod`

### Variables d'Environnement Railway

```env
# Database (automatique si vous ajoutez PostgreSQL via Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Application
NODE_ENV=production
PORT=3001
API_URL=https://${{RAILWAY_STATIC_URL}}
WEB_URL=https://votre-app.vercel.app

# JWT (CHANGEZ CES VALEURS!)
JWT_SECRET=generez_un_secret_aleatoire_long_et_securise_64_caracteres_minimum
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=un_autre_secret_aleatoire_different_du_premier
JWT_REFRESH_EXPIRES_IN=30d

# Discord OAuth2
DISCORD_CLIENT_ID=votre_client_id
DISCORD_CLIENT_SECRET=votre_client_secret
DISCORD_REDIRECT_URI=https://votre-app.vercel.app/auth/callback
DISCORD_BOT_TOKEN=votre_bot_token

# GitHub OAuth (optionnel)
GITHUB_CLIENT_ID=votre_github_client_id
GITHUB_CLIENT_SECRET=votre_github_client_secret
GITHUB_REDIRECT_URI=https://votre-app.vercel.app/auth/github/callback

# CORS
CORS_ORIGIN=https://votre-app.vercel.app

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# Logging
LOG_LEVEL=info
```

### Exécuter les Migrations

Une fois déployé sur Railway :

```bash
# Se connecter au projet
railway link

# Exécuter les migrations
railway run npm run prisma:migrate
```

## 🗄️ Options de Base de Données

### Railway PostgreSQL (Recommandé - Gratuit au début)
- Inclus avec Railway
- Configuration automatique via `${{Postgres.DATABASE_URL}}`
- Backups automatiques

### Supabase (Gratuit jusqu'à 500MB)
```bash
# 1. Créez un projet sur https://supabase.com
# 2. Copiez la connection string PostgreSQL
# 3. Ajoutez à vos variables d'environnement
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
```

### Neon (Serverless PostgreSQL)
```bash
# 1. Créez un projet sur https://neon.tech
# 2. Copiez la connection string
DATABASE_URL=postgresql://[user]:[password]@[host].neon.tech/[dbname]
```

## 🔧 Déploiement Backend sur Render

Alternative à Railway :

1. Créez un compte sur https://render.com
2. Cliquez sur "New +" → "Web Service"
3. Connectez votre GitHub
4. Configurez :
   - **Root Directory** : `apps/api`
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `node dist/main.js`
   - **Environment** : Node
5. Ajoutez PostgreSQL (New → PostgreSQL)
6. Ajoutez les variables d'environnement

## 🔐 Configuration Discord Application

⚠️ **IMPORTANT** : Mettez à jour votre application Discord avec les URLs de production

1. Allez sur https://discord.com/developers/applications
2. Sélectionnez votre application
3. **OAuth2** → **Redirects** :
   ```
   https://votre-app.vercel.app/auth/callback
   ```
4. Mettez à jour `DISCORD_REDIRECT_URI` dans vos variables d'environnement

## 🔍 Vérification du Déploiement

### Frontend
```bash
# Testez l'URL Vercel
curl https://votre-app.vercel.app
```

### Backend
```bash
# Testez l'API
curl https://votre-api.railway.app/api/health

# Testez la documentation Swagger
# Ouvrez dans le navigateur
https://votre-api.railway.app/api/docs
```

### Bot Discord
Vérifiez les logs Railway/Render :
```
✅ Discord bot connected as: YourBot#1234
✅ Listening for events in X guilds
```

## 🐛 Dépannage

### Frontend ne se connecte pas à l'API
```bash
# Vérifiez les variables d'environnement Vercel
vercel env ls

# Vérifiez que NEXT_PUBLIC_API_URL pointe vers votre API Railway
# Format: https://votre-api.railway.app/api
```

### Erreur CORS
Vérifiez que `CORS_ORIGIN` dans votre backend Railway correspond à votre URL Vercel :
```env
CORS_ORIGIN=https://votre-app.vercel.app
```

### Bot Discord ne se connecte pas
```bash
# Vérifiez les logs Railway
railway logs

# Vérifiez que DISCORD_BOT_TOKEN est correct
# Vérifiez que les Intents sont activés sur Discord Developers Portal
```

### Erreur de Base de Données
```bash
# Vérifiez que DATABASE_URL est correct
railway variables

# Testez la connexion
railway run npm run prisma:studio

# Re-exécutez les migrations
railway run npm run prisma:migrate
```

### Build Vercel échoue
```bash
# Testez le build localement
cd apps/web
npm run build

# Si ça fonctionne localement mais pas sur Vercel,
# vérifiez Node version dans package.json
```

Ajoutez dans `apps/web/package.json` :
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## 📊 Monitoring (Recommandé)

### Vercel Analytics
Activez dans Settings → Analytics (gratuit)

### Railway Logs
```bash
railway logs --follow
```

### Sentry (Error Tracking)
```bash
# Backend
npm install @sentry/node --workspace=apps/api

# Frontend
npm install @sentry/nextjs --workspace=apps/web
```

## 💰 Coûts Estimés

### Plan Gratuit
- **Vercel** : 100GB bandwidth/mois (gratuit)
- **Railway** : $5 crédit gratuit/mois (~500h)
- **Supabase** : 500MB (gratuit)
- **Total** : ~$0-5/mois

### Plan Production (petit serveur)
- **Vercel Pro** : $20/mois
- **Railway** : ~$10-20/mois
- **Supabase Pro** : $25/mois
- **Total** : ~$55-65/mois

## ✅ Checklist de Déploiement

- [ ] Code pushé sur GitHub
- [ ] Variables d'environnement configurées (production)
- [ ] Discord OAuth redirect URI mis à jour
- [ ] Base de données créée
- [ ] Migrations exécutées
- [ ] Frontend déployé sur Vercel
- [ ] Backend déployé sur Railway/Render
- [ ] Bot Discord connecté (vérifier les logs)
- [ ] Test de connexion OAuth
- [ ] Test des fonctionnalités principales
- [ ] Monitoring configuré
- [ ] Backups automatiques activés

## 🔄 Mises à Jour

### Frontend (Vercel)
```bash
# Commit et push → déploiement automatique
git add .
git commit -m "Update frontend"
git push
```

### Backend (Railway)
```bash
# Commit et push → déploiement automatique
git add .
git commit -m "Update backend"
git push

# Si vous avez modifié le schéma Prisma
railway run npm run prisma:migrate
```

## 🆘 Support

- **Vercel Docs** : https://vercel.com/docs
- **Railway Docs** : https://docs.railway.app
- **Discord.js** : https://discord.js.org

---

**Besoin d'aide ?** Créez une issue sur GitHub !
