# 🏗️ Architecture Technique - Discord Dashboard

## Vue d'ensemble

Application web full-stack en architecture monorepo, séparant clairement frontend (Next.js) et backend (NestJS) avec une couche de types partagés.

## 📐 Architecture Globale

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           Next.js 14 (App Router)                     │  │
│  │  - React Server Components                             │  │
│  │  - Client Components (interactifs)                     │  │
│  │  - TanStack Query (cache + sync)                       │  │
│  │  - Zustand (state global)                              │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕ HTTP / WebSocket
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND API                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │               NestJS Framework                         │  │
│  │  - Controllers (REST API)                              │  │
│  │  - Services (Business Logic)                           │  │
│  │  - Guards (Auth + Permissions)                         │  │
│  │  - WebSocket Gateway (Socket.IO)                       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                      PERSISTENCE                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ PostgreSQL   │  │    Redis     │  │  Discord API  │      │
│  │   (Prisma)   │  │   (Cache)    │  │   (External)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Modules Backend (NestJS)

### 1. Auth Module
**Responsabilité**: Authentification et autorisation

```typescript
┌─────────────────────────────────────┐
│          Auth Module                │
├─────────────────────────────────────┤
│ • DiscordStrategy (Passport)        │
│ • JwtStrategy (Passport)            │
│ • AuthController                     │
│ • AuthService                        │
│ • JwtAuthGuard                       │
│ • RolesGuard (RBAC)                  │
│ • PermissionsGuard                   │
└─────────────────────────────────────┘
```

**Flux OAuth2 Discord**:
1. User clique "Se connecter avec Discord"
2. Redirection vers Discord OAuth2
3. Discord callback avec code
4. Exchange code → access token
5. Fetch user info + guilds
6. Vérification appartenance serveur
7. Génération JWT
8. Retour frontend avec token

### 2. Discord Bot Module
**Responsabilité**: Bot Discord pour événements temps réel

```typescript
┌─────────────────────────────────────┐
│       Discord Bot Module            │
├─────────────────────────────────────┤
│ • DiscordBotService                  │
│ • Event Listeners:                   │
│   - voiceStateUpdate                 │
│   - guildMemberAdd/Remove            │
│   - guildMemberUpdate                │
│   - messageCreate                    │
│ • Command Handler                    │
│ • WebSocket Emitter                  │
└─────────────────────────────────────┘
```

**Events écoutés**:
- `voiceStateUpdate`: Tracking vocal (join/leave/mute/deafen)
- `guildMemberUpdate`: Changements de rôles
- `guildMemberAdd/Remove`: Entrées/sorties serveur
- `messageCreate`: Logs messages (optionnel)

### 3. Voice Tracking Module
**Responsabilité**: Calcul temps de présence vocal

```typescript
┌─────────────────────────────────────┐
│     Voice Tracking Module           │
├─────────────────────────────────────┤
│ • VoiceSessionService                │
│   - startSession()                   │
│   - endSession()                     │
│   - calculateDuration()              │
│ • VoiceStatsService                  │
│   - getDailyStats()                  │
│   - getWeeklyStats()                 │
│   - getMonthlyStats()                │
│   - exportToCSV()                    │
│ • VoiceController                    │
└─────────────────────────────────────┘
```

**Logique métier**:
```typescript
// Détection AFK
if (member.selfDeaf || member.serverDeaf) {
  session.afkTime += duration;
} else {
  session.activeTime += duration;
}

// Calcul temps total
totalTime = activeTime + afkTime;
```

### 4. Service Tracking Module
**Responsabilité**: Prise de service staff

```typescript
┌─────────────────────────────────────┐
│    Service Tracking Module          │
├─────────────────────────────────────┤
│ • ServiceSessionService              │
│   - startService()                   │
│   - endService()                     │
│   - getActiveServices()              │
│ • ServiceStatsService                │
│   - getStaffStats()                  │
│   - getServiceHistory()              │
│ • ServiceController                  │
└─────────────────────────────────────┘
```

**Règles métier**:
- Salon vocal dédié configuré (ex: "🎤 Service Staff")
- Détection automatique: staff rejoint → service commence
- Staff quitte → service termine
- Calcul durée totale de service

### 5. Stats Module
**Responsabilité**: Statistiques et analytics

```typescript
┌─────────────────────────────────────┐
│         Stats Module                 │
├─────────────────────────────────────┤
│ • DashboardStatsService              │
│   - getRealtimeStats()               │
│   - getGraphData()                   │
│   - getActivityStats()               │
│ • StatsController                    │
│ • Cache Strategy (Redis)             │
└─────────────────────────────────────┘
```

**Métriques**:
- Membres online/offline/idle/dnd
- Staff en service (temps réel)
- Activité journalière (connexions)
- Graphiques: courbes présence 7/30 jours

### 6. Logs Module
**Responsabilité**: Audit logs et historique

```typescript
┌─────────────────────────────────────┐
│          Logs Module                 │
├─────────────────────────────────────┤
│ • AuditLogService                    │
│   - createLog()                      │
│   - getLogs(filters)                 │
│   - exportLogs()                     │
│ • LogsController                     │
│ • Log Types:                         │
│   - AUTH                             │
│   - VOICE                            │
│   - ROLE                             │
│   - SERVICE                          │
│   - MODERATION                       │
│   - SYSTEM                           │
└─────────────────────────────────────┘
```

### 7. Roles Module
**Responsabilité**: Gestion rôles à distance

```typescript
┌─────────────────────────────────────┐
│         Roles Module                 │
├─────────────────────────────────────┤
│ • RolesService                       │
│   - assignRole()                     │
│   - removeRole()                     │
│   - checkHierarchy()                 │
│ • RolesController                    │
│ • Permissions Guard                  │
└─────────────────────────────────────┘
```

**Règles hiérarchiques**:
- Admin ne peut pas modifier rôle supérieur
- Vérification position rôle bot
- Logs de tous changements

### 8. Events Module
**Responsabilité**: Calendrier événements

```typescript
┌─────────────────────────────────────┐
│        Events Module                 │
├─────────────────────────────────────┤
│ • EventsService                      │
│   - createEvent()                    │
│   - updateEvent()                    │
│   - assignMembers()                  │
│ • EventsController                   │
│ • Notification Service               │
└─────────────────────────────────────┘
```

### 9. Tickets Module
**Responsabilité**: Système de tickets support

```typescript
┌─────────────────────────────────────┐
│        Tickets Module                │
├─────────────────────────────────────┤
│ • TicketsService                     │
│   - createTicket()                   │
│   - assignTicket()                   │
│   - closeTicket()                    │
│ • TicketsController                  │
│ • Status: OPEN/ASSIGNED/CLOSED       │
└─────────────────────────────────────┘
```

### 10. Chat Module
**Responsabilité**: Chat interne staff

```typescript
┌─────────────────────────────────────┐
│          Chat Module                 │
├─────────────────────────────────────┤
│ • ChatGateway (WebSocket)            │
│ • ChatService                        │
│   - sendMessage()                    │
│   - getRoomHistory()                 │
│ • Rooms par rôle                     │
└─────────────────────────────────────┘
```

### 11. GitHub Module
**Responsabilité**: Intégration GitHub

```typescript
┌─────────────────────────────────────┐
│        GitHub Module                 │
├─────────────────────────────────────┤
│ • GitHubStrategy (OAuth)             │
│ • GitHubService                      │
│   - getRepositories()                │
│   - getIssues()                      │
│   - getPullRequests()                │
│   - getCommits()                     │
│ • GitHubController                   │
└─────────────────────────────────────┘
```

## 🎨 Frontend Architecture (Next.js)

### App Router Structure
```
app/
├── (auth)/                    # Auth routes (pas de layout dashboard)
│   ├── login/
│   └── callback/
├── (dashboard)/               # Dashboard routes (avec layout)
│   ├── layout.tsx            # Layout principal
│   ├── page.tsx              # Dashboard home
│   ├── logs/
│   ├── presence/
│   ├── services/
│   ├── roles/
│   ├── calendar/
│   ├── chat/
│   ├── tickets/
│   └── settings/
└── api/                       # API Routes (proxy)
    └── auth/
```

### Composants Structure
```
components/
├── ui/                        # ShadCN components
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── ...
├── dashboard/                 # Business components
│   ├── stats-card.tsx
│   ├── activity-graph.tsx
│   ├── logs-table.tsx
│   ├── presence-table.tsx
│   └── ...
└── layouts/
    ├── sidebar.tsx
    ├── navbar.tsx
    └── ...
```

### State Management

**Zustand Stores**:
```typescript
// useAuthStore
- user
- token
- isAuthenticated
- login()
- logout()

// useServerStore
- selectedServer
- servers
- setSelectedServer()

// usePresenceStore
- onlineUsers
- updatePresence()
```

**TanStack Query**:
- Cache API responses
- Auto-refetch
- Optimistic updates
- Infinite queries (logs)

### WebSocket Client
```typescript
// Socket.IO connection
socket.on('presence:update', (data) => {
  queryClient.invalidateQueries(['presence']);
});

socket.on('log:new', (log) => {
  queryClient.setQueryData(['logs'], (old) => [log, ...old]);
});
```

## 💾 Base de Données (Prisma Schema)

### Modèles principaux

**User**: Utilisateurs Discord
**Server**: Serveurs Discord gérés
**Role**: Rôles Discord
**VoiceLog**: Logs présence vocale
**ServiceLog**: Logs prise de service
**AuditLog**: Logs audit actions
**Event**: Événements calendrier
**Ticket**: Tickets support
**Message**: Messages chat interne
**GitHubAccount**: Comptes GitHub liés

### Relations

```
User 1---* VoiceLog
User 1---* ServiceLog
User 1---* AuditLog
User 1---* Ticket (creator)
User 1---* Message

Server 1---* Role
Server 1---* VoiceLog
Server 1---* ServiceLog
Server 1---* Event
Server 1---* Ticket

Event *---* User (attendees)
```

## 🔒 Sécurité

### Authentification
1. OAuth2 Discord (frontend)
2. JWT stocké httpOnly cookie
3. Refresh token mechanism
4. Auto logout si token invalide

### Autorisation (RBAC)

```typescript
@Roles('ADMIN', 'MODERATOR')
@UseGuards(JwtAuthGuard, RolesGuard)
async assignRole() {
  // Only admins and moderators
}
```

**Hiérarchie permissions**:
```
OWNER > ADMIN > MODERATOR > STAFF > MEMBER
```

### Protection API
- Rate limiting (ThrottlerModule)
- CORS configuré
- Helmet (security headers)
- Input validation (class-validator)
- SQL injection protection (Prisma)
- XSS protection

## 🚀 Performance

### Backend
- Redis cache (stats, user sessions)
- Database indexing (Prisma)
- Connection pooling
- Lazy loading relations
- Pagination (cursor-based)

### Frontend
- React Server Components
- Dynamic imports
- Image optimization (next/image)
- Font optimization
- Bundle splitting

## 📊 Monitoring & Logs

### Application Logs
```typescript
// Winston logger
logger.info('User logged in', { userId, ip });
logger.error('Failed to fetch data', { error, context });
```

### Métriques
- Request duration
- Error rate
- Active connections
- Cache hit rate

## 🔄 CI/CD (à implémenter)

```yaml
# Suggestion pipeline
1. Lint & Format check
2. Type check
3. Unit tests
4. E2E tests
5. Build
6. Deploy (staging/prod)
```

## 📱 Responsive Design

Breakpoints Tailwind:
- `sm`: 640px (mobile)
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)
- `xl`: 1280px (large desktop)

Layout adapté:
- Mobile: sidebar collapsible
- Tablet: sidebar fixe réduite
- Desktop: sidebar complète

---

**Architecture conçue pour être scalable, maintenable et sécurisée.**
