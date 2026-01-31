# 🚀 Guide de Démarrage Rapide - Discord Dashboard

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** 18+ ([Télécharger](https://nodejs.org/))
- **PostgreSQL** 14+ ([Télécharger](https://www.postgresql.org/download/))
- **npm** ou **yarn**

## 📦 Installation

### 1. Installation des dépendances

À la racine du projet :

```bash
npm install
```

### 2. Configuration de la base de données

Créez une base de données PostgreSQL :

```bash
createdb discord_dashboard
```

Ou via psql :

```sql
CREATE DATABASE discord_dashboard;
```

### 3. Configuration des variables d'environnement

#### Backend (apps/api/.env)

Copiez le fichier d'exemple :

```bash
cp apps/api/.env.example apps/api/.env
```

Puis éditez `apps/api/.env` avec vos valeurs :

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/discord_dashboard?schema=public"

# JWT
JWT_SECRET=votre_secret_jwt_tres_securise_ici
JWT_EXPIRES_IN=7d

# Discord
DISCORD_CLIENT_ID=votre_discord_client_id
DISCORD_CLIENT_SECRET=votre_discord_client_secret
DISCORD_REDIRECT_URI=http://localhost:3000/auth/callback
DISCORD_BOT_TOKEN=votre_discord_bot_token

# App
API_URL=http://localhost:3001
WEB_URL=http://localhost:3000
NODE_ENV=development
```

#### Frontend (apps/web/.env.local)

Copiez le fichier d'exemple :

```bash
cp apps/web/.env.local.example apps/web/.env.local
```

Puis éditez `apps/web/.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=http://localhost:3001
NEXT_PUBLIC_DISCORD_CLIENT_ID=votre_discord_client_id
```

### 4. Configuration de l'application Discord

1. Allez sur [Discord Developer Portal](https://discord.com/developers/applications)
2. Créez une nouvelle application
3. Dans **OAuth2** :
   - Ajoutez `http://localhost:3000/auth/callback` dans **Redirects**
   - Copiez le **Client ID** et **Client Secret**
4. Dans **Bot** :
   - Créez un bot
   - Copiez le **Token**
   - Activez les **Intents** : Presence, Server Members, Message Content
5. Invitez le bot sur votre serveur avec les permissions nécessaires

### 5. Génération de Prisma et migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

## 🎯 Démarrage

### Développement (tout en un)

À la racine du projet :

```bash
npm run dev
```

Cela démarre :
- ✅ Backend API sur http://localhost:3001
- ✅ Frontend Next.js sur http://localhost:3000
- ✅ Bot Discord (connecté automatiquement)

### Développement (séparé)

#### Backend uniquement

```bash
npm run dev:api
```

#### Frontend uniquement

```bash
npm run dev:web
```

### Build Production

```bash
npm run build
```

## 📚 Accès aux services

Une fois démarré, vous pouvez accéder à :

- **Frontend** : http://localhost:3000
- **API Backend** : http://localhost:3001/api
- **Documentation Swagger** : http://localhost:3001/api/docs
- **Prisma Studio** : `npm run prisma:studio` puis http://localhost:5555

## 🔐 Premier utilisateur

1. Allez sur http://localhost:3000
2. Cliquez sur "Se connecter avec Discord"
3. Autorisez l'application
4. Sélectionnez votre serveur Discord
5. Vous êtes redirigé vers le dashboard !

## 🛠️ Commandes utiles

### Base de données

```bash
# Générer le client Prisma
npm run prisma:generate

# Créer une migration
npm run prisma:migrate

# Ouvrir Prisma Studio (interface visuelle)
npm run prisma:studio

# Reset la base de données (⚠️ ATTENTION)
npx prisma migrate reset --schema apps/api/prisma/schema.prisma
```

### Développement

```bash
# Lancer tout (API + Web)
npm run dev

# Lancer uniquement l'API
npm run dev:api

# Lancer uniquement le frontend
npm run dev:web

# Build production
npm run build

# Lancer en production
npm run start:prod
```

### Tests

```bash
# Tests unitaires
npm run test

# Tests avec coverage
npm run test:cov
```

## 🏗️ Structure du Projet

```
.
├── apps/
│   ├── api/              # Backend NestJS
│   │   ├── src/
│   │   │   ├── modules/  # Modules métier
│   │   │   ├── common/   # Prisma, guards, etc.
│   │   │   └── main.ts
│   │   └── prisma/
│   │       └── schema.prisma
│   │
│   └── web/              # Frontend Next.js
│       ├── src/
│       │   ├── app/      # App Router
│       │   ├── components/
│       │   ├── lib/
│       │   ├── hooks/
│       │   ├── stores/
│       │   └── types/
│       └── public/
│
├── package.json          # Root package.json (workspaces)
├── README.md
├── ARCHITECTURE.md
└── QUICKSTART.md         # Ce fichier
```

## 🎨 Fonctionnalités Implémentées

### ✅ Authentification
- OAuth2 Discord
- JWT tokens
- Protection des routes
- Vérification appartenance serveur

### ✅ Dashboard
- Statistiques en temps réel
- Graphiques d'activité
- Top membres
- Services actifs

### ✅ Tracking Vocal
- Sessions vocales
- Calcul temps AFK / actif
- Export CSV
- Historique complet

### ✅ Prise de Service
- Détection automatique
- Historique services
- Statistiques staff

### ✅ Logs & Audit
- Tous types d'actions
- Filtrage avancé
- Recherche

### ✅ Gestion des Rôles
- Attribution / retrait
- Hiérarchie
- Synchronisation Discord

### ✅ Calendrier
- Événements
- Participants
- Notifications

### ✅ Système de Tickets
- Création / assignation
- Messages
- Statuts

### ✅ Chat Interne
- WebSocket temps réel
- Rooms par rôle
- Historique

### ✅ Intégration GitHub
- Repositories
- Issues / PRs
- Commits

### ✅ Bot Discord
- Écoute événements vocaux
- Tracking automatique
- Logs en temps réel

## 🐛 Dépannage

### Le bot ne se connecte pas

Vérifiez que :
- Le token Discord est correct dans `.env`
- Les intents sont activés dans le Developer Portal
- Le bot a été invité sur le serveur

### Erreur de connexion à la base de données

Vérifiez que :
- PostgreSQL est démarré
- Les credentials dans `DATABASE_URL` sont corrects
- La base de données existe

### Erreur CORS

Vérifiez que :
- `WEB_URL` dans l'API correspond à l'URL du frontend
- `NEXT_PUBLIC_API_URL` dans le frontend correspond à l'API

### Les sessions ne sont pas trackées

Vérifiez que :
- Le bot Discord est bien connecté (voir les logs au démarrage)
- Le serveur est configuré dans la base de données
- Les canaux de service sont configurés dans `ServerConfig`

## 📞 Support

Pour toute question :
- Consultez la documentation complète dans [README.md](README.md)
- Lisez l'architecture dans [ARCHITECTURE.md](ARCHITECTURE.md)
- Vérifiez les logs de l'API et du bot

## 🎉 Vous êtes prêt !

Tout est maintenant configuré. Bon développement ! 🚀

---

**Note** : Pour un déploiement en production, pensez à :
- Changer tous les secrets / tokens
- Configurer HTTPS
- Utiliser une base de données sécurisée
- Activer les backups
- Configurer un reverse proxy (nginx)
- Utiliser des variables d'environnement sécurisées
