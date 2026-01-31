# 🎯 Discord Dashboard - Panel d'Administration Professionnel

Dashboard web de gestion et supervision pour serveurs Discord, conçu pour une utilisation professionnelle par le staff et l'administration.

## 🏗️ Architecture

### Monorepo Structure
```
.
├── apps/
│   ├── web/          # Frontend Next.js 14 (App Router)
│   └── api/          # Backend NestJS
└── packages/
    └── shared/       # Types TypeScript partagés
```

## 🚀 Stack Technique

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI**: Tailwind CSS + ShadCN UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **WebSocket**: Socket.IO Client

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: Passport (Discord OAuth2)
- **WebSocket**: Socket.IO
- **Validation**: Class Validator
- **Documentation**: Swagger

## 📊 Fonctionnalités

### ✅ Implémentées
- 🔐 Authentification OAuth2 Discord
- 📊 Dashboard temps réel
- 📝 Système de logs complet
- ⏱️ Tracking temps de présence vocal
- 🎤 Prise de service automatique
- 👥 Gestion des rôles à distance
- 📅 Calendrier événements
- 💬 Chat interne staff
- 🔗 Intégration GitHub
- 🎫 Système de tickets
- 📄 Rapports staff
- 🔔 Notifications

### 🔒 Sécurité
- Role-Based Access Control (RBAC)
- Audit logs pour toutes actions sensibles
- Vérification appartenance serveur
- Permissions hiérarchiques
- Protection CSRF

## 🚀 Installation

### Prérequis
- Node.js 18+
- PostgreSQL 14+
- Application Discord (OAuth2)
- Compte GitHub (optionnel)

### Configuration

1. **Cloner et installer**
```bash
npm install
```

2. **Configuration environnement**

Copier `.env.example` dans `apps/api/.env` et configurer:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/discord_dashboard"

# Discord
DISCORD_CLIENT_ID="your_client_id"
DISCORD_CLIENT_SECRET="your_client_secret"
DISCORD_BOT_TOKEN="your_bot_token"
DISCORD_REDIRECT_URI="http://localhost:3000/api/auth/discord/callback"

# JWT
JWT_SECRET="your_super_secret_jwt_key"
JWT_EXPIRES_IN="7d"

# App
API_URL="http://localhost:3001"
WEB_URL="http://localhost:3000"
NODE_ENV="development"

# GitHub (optionnel)
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
```

3. **Base de données**
```bash
npm run prisma:generate
npm run prisma:migrate
```

4. **Lancer l'application**
```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- API Docs: http://localhost:3001/api/docs

## 🎯 Utilisation

### Première connexion
1. Accéder à http://localhost:3000
2. Se connecter avec Discord
3. Autoriser l'application
4. Sélectionner le serveur à gérer

### Permissions
Le système de permissions est basé sur les rôles Discord:
- **Owner/Admin**: Accès complet
- **Moderator**: Gestion membres, logs, tickets
- **Staff**: Prise de service, rapports
- **Membre**: Lecture seule

## 📚 Documentation API

API REST documentée avec Swagger: `http://localhost:3001/api/docs`

### Endpoints principaux
- `POST /auth/discord` - Authentification Discord
- `GET /stats/dashboard` - Statistiques dashboard
- `GET /logs` - Historique logs
- `GET /voice/presence` - Temps de présence
- `GET /services` - Historique services
- `POST /roles` - Gestion rôles
- `GET /events` - Calendrier
- `GET /tickets` - Tickets support

## 🏗️ Architecture Détaillée

### Frontend (Next.js)
```
apps/web/
├── src/
│   ├── app/              # App Router
│   │   ├── (auth)/       # Pages authentification
│   │   ├── (dashboard)/  # Pages dashboard
│   │   └── api/          # API Routes
│   ├── components/       # Composants React
│   │   ├── ui/          # ShadCN components
│   │   ├── dashboard/   # Composants métier
│   │   └── layouts/     # Layouts
│   ├── lib/             # Utilities
│   ├── hooks/           # Custom hooks
│   ├── stores/          # Zustand stores
│   └── types/           # TypeScript types
```

### Backend (NestJS)
```
apps/api/
├── src/
│   ├── auth/            # Module authentification
│   ├── users/           # Module utilisateurs
│   ├── servers/         # Module serveurs Discord
│   ├── stats/           # Module statistiques
│   ├── logs/            # Module logs
│   ├── voice/           # Module tracking vocal
│   ├── services/        # Module prise de service
│   ├── roles/           # Module gestion rôles
│   ├── events/          # Module calendrier
│   ├── tickets/         # Module tickets
│   ├── chat/            # Module chat interne
│   ├── github/          # Module intégration GitHub
│   ├── notifications/   # Module notifications
│   ├── discord-bot/     # Bot Discord service
│   └── common/          # Guards, decorators, filters
```

## 🔄 Temps Réel

WebSocket events (Socket.IO):
- `user:connected` - Connexion utilisateur
- `presence:update` - Mise à jour présence
- `voice:join` - Entrée vocal
- `voice:leave` - Sortie vocal
- `service:start` - Début service
- `service:end` - Fin service
- `role:update` - Changement rôle
- `log:new` - Nouveau log
- `notification:new` - Nouvelle notification

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 📦 Build & Déploiement

```bash
# Build production
npm run build

# Start production
npm run start:prod
```

## 🛠️ Développement

### Conventions
- Code modulaire et maintenable
- Typage strict TypeScript
- Commentaires sur parties critiques
- Commits conventionnels
- Tests pour logique métier

### Structure commits
```
feat: nouvelle fonctionnalité
fix: correction bug
docs: documentation
refactor: refactoring
test: ajout tests
chore: tâches maintenance
```

## 📄 Licence

MIT

## 👥 Support

Pour toute question ou assistance:
- GitHub Issues
- Documentation complète dans `/docs`

---

**Made with ❤️ for professional Discord server management**
