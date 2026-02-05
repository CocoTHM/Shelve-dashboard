# Discord Dashboard - Backend API

Backend NestJS pour le Discord Dashboard avec WebSocket, authentification JWT et intégration Discord.

## 🚀 Déploiement sur Railway

### Déploiement rapide

1. **Fork ce repository sur GitHub**

2. **Créer un nouveau projet sur Railway**
   - Allez sur https://railway.app/new
   - Cliquez sur "Deploy from GitHub repo"
   - Sélectionnez ce repository

3. **Ajouter PostgreSQL**
   - Dans le projet Railway, cliquez sur "+ New"
   - Sélectionnez "Database" → "PostgreSQL"
   - Railway configure automatiquement `DATABASE_URL`

4. **Variables d'environnement**
   
   Dans Railway Dashboard → Variables :
   ```
   DATABASE_URL=postgresql://... (automatique)
   JWT_SECRET=votre_secret_jwt_super_securise
   DISCORD_CLIENT_ID=votre_discord_client_id
   DISCORD_CLIENT_SECRET=votre_discord_client_secret
   DISCORD_BOT_TOKEN=votre_discord_bot_token
   DISCORD_REDIRECT_URI=https://votre-frontend.vercel.app/auth/callback
   NODE_ENV=production
   PORT=3001
   ```

5. **Déployer**
   - Railway détecte automatiquement NestJS
   - Le déploiement démarre automatiquement

### Configuration

Le build est configuré via `railway.json` et `nixpacks.toml`.

**Build command :**
```bash
npm install && npx prisma generate && npm run build
```

**Start command :**
```bash
npm run start:prod
```

### Migrations de base de données

Après le premier déploiement :

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Se connecter
railway login --browserless

# Lier le projet
railway link

# Exécuter les migrations
railway run npm run prisma:migrate
```

## 🛠️ Développement local

```bash
# Installer les dépendances
npm install

# Copier .env.example vers .env
cp .env.example .env

# Configurer la base de données dans .env
DATABASE_URL="postgresql://user:password@localhost:5432/discord_dashboard"

# Générer le client Prisma
npm run prisma:generate

# Exécuter les migrations
npm run prisma:migrate

# Lancer en mode développement
npm run dev
```

L'API sera disponible sur http://localhost:3001

### Documentation API

Une fois lancé, accédez à la documentation Swagger :
- http://localhost:3001/api/docs

## 📦 Scripts disponibles

```bash
npm run dev              # Développement avec watch
npm run build            # Build pour production
npm run start:prod       # Lancer en production
npm run prisma:generate  # Générer le client Prisma
npm run prisma:migrate   # Exécuter les migrations
npm run prisma:studio    # Interface Prisma Studio
npm run lint             # Linter
npm run test             # Tests unitaires
```

## 🗄️ Base de données

Le projet utilise **Prisma ORM** avec PostgreSQL.

**Schema :** Voir `prisma/schema.prisma`

**Migrations :**
- Les migrations sont dans `prisma/migrations/`
- Créer une migration : `npm run prisma:migrate`

## 🔐 Authentification

L'API utilise JWT avec Passport pour l'authentification Discord OAuth2.

**Endpoints :**
- `POST /auth/discord` - Initier OAuth2
- `GET /auth/callback` - Callback Discord
- `GET /auth/me` - Profil utilisateur (protégé)

## 🌐 WebSocket

WebSocket pour les mises à jour en temps réel :
- **Gateway :** `/socket.io`
- **Events :** Voir `src/modules/chat/chat.gateway.ts`

## 📁 Structure

```
src/
├── common/            # Modules partagés (Prisma, etc.)
├── modules/
│   ├── auth/         # Authentification JWT + Discord
│   ├── users/        # Gestion utilisateurs
│   ├── servers/      # Serveurs Discord
│   ├── tickets/      # Système de tickets
│   ├── chat/         # WebSocket chat
│   ├── voice/        # Statistiques vocales
│   ├── stats/        # Statistiques
│   └── ...
├── app.module.ts     # Module principal
└── main.ts           # Point d'entrée
```

## 🔗 Frontend

Le frontend est déployé séparément :
- Repository : [lien vers votre repo frontend]
- Vercel : [URL de production]

## 📝 Variables d'environnement

Créez un fichier `.env` :

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/discord_dashboard"

# JWT
JWT_SECRET="votre_secret_super_securise"
JWT_EXPIRES_IN="7d"

# Discord OAuth2
DISCORD_CLIENT_ID="votre_client_id"
DISCORD_CLIENT_SECRET="votre_client_secret"
DISCORD_BOT_TOKEN="votre_bot_token"
DISCORD_REDIRECT_URI="http://localhost:3000/auth/callback"

# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:3000"
```

## 🚨 Santé de l'API

**Health check :** `GET /api/health`

## 📄 Licence

MIT
