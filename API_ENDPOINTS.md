# 📡 API Endpoints - Discord Dashboard

Documentation complète des endpoints API disponibles.

Base URL: `http://localhost:3001/api`

Documentation Swagger interactive : `http://localhost:3001/api/docs`

## 🔐 Authentification

Tous les endpoints (sauf auth) nécessitent un token JWT dans le header :
```
Authorization: Bearer <token>
```

### POST /auth/discord/callback
Échange le code Discord OAuth2 contre un JWT

**Body:**
```json
{
  "code": "discord_oauth_code",
  "state": "{\"serverId\":\"123\"}" // optionnel
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "discordId": "123456789",
    "username": "User#1234",
    "avatar": "hash",
    "email": "user@example.com"
  },
  "token": "jwt_token",
  "expiresIn": "7d"
}
```

### GET /auth/discord
Obtenir l'URL d'autorisation Discord

**Query Params:**
- `serverId` (optionnel): ID du serveur Discord

**Response:**
```json
{
  "url": "https://discord.com/api/oauth2/authorize?..."
}
```

### POST /auth/refresh
Rafraîchir le token JWT

**Response:**
```json
{
  "token": "new_jwt_token",
  "expiresIn": "7d"
}
```

### GET /auth/me
Obtenir l'utilisateur connecté

## 📊 Statistiques

### GET /stats/dashboard
Statistiques globales du dashboard

**Query Params:**
- `serverId` (requis): ID du serveur

**Response:**
```json
{
  "totalMembers": 150,
  "activeServices": 3,
  "todayConnections": 45,
  "activeSessions": 12,
  "topMembers": [
    {
      "id": "user_id",
      "username": "User#1234",
      "avatar": "hash",
      "total_time": 3600
    }
  ]
}
```

### GET /stats/activity
Données d'activité pour graphiques

**Query Params:**
- `serverId` (requis): ID du serveur
- `days` (optionnel): Nombre de jours (défaut: 7)

**Response:**
```json
[
  {
    "date": "01/01",
    "connections": 25,
    "uniqueUsers": 18
  }
]
```

### GET /stats/services
Statistiques de service

**Query Params:**
- `serverId` (requis): ID du serveur

**Response:**
```json
{
  "todayServices": 5,
  "weekServices": 28,
  "weekServiceTime": 86400,
  "topStaff": [...]
}
```

## 🎤 Tracking Vocal

### GET /voice/history
Historique vocal d'un utilisateur

**Query Params:**
- `userId` (requis): ID de l'utilisateur
- `serverId` (requis): ID du serveur
- `page` (optionnel): Page (défaut: 1)
- `limit` (optionnel): Limite par page (défaut: 50)

**Response:**
```json
{
  "logs": [
    {
      "id": "log_id",
      "channelName": "Vocal 1",
      "joinedAt": "2026-01-31T10:00:00Z",
      "leftAt": "2026-01-31T11:30:00Z",
      "duration": 5400,
      "activeDuration": 4800,
      "afkDuration": 600
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 50,
    "pages": 3
  }
}
```

### GET /voice/stats
Statistiques vocales d'un utilisateur

**Query Params:**
- `userId` (requis): ID de l'utilisateur
- `serverId` (requis): ID du serveur
- `days` (optionnel): Nombre de jours (défaut: 7)

**Response:**
```json
{
  "totalTime": 86400,
  "activeTime": 72000,
  "afkTime": 14400,
  "sessionCount": 15,
  "averageSessionTime": 5760
}
```

### GET /voice/active
Sessions vocales actives

**Query Params:**
- `serverId` (requis): ID du serveur

**Response:**
```json
[
  {
    "id": "session_id",
    "channelName": "Vocal 1",
    "joinedAt": "2026-01-31T10:00:00Z",
    "user": {
      "id": "user_id",
      "username": "User#1234",
      "avatar": "hash"
    }
  }
]
```

### GET /voice/export
Exporter les données vocales en CSV

**Query Params:**
- `serverId` (requis): ID du serveur
- `startDate` (requis): Date de début (ISO)
- `endDate` (requis): Date de fin (ISO)

**Response:**
```json
{
  "csv": "Username,Channel,Joined,Left,...",
  "filename": "voice_logs_serverId_2026-01-01_2026-01-31.csv"
}
```

## 👥 Services

### GET /services/active
Services actifs sur le serveur

**Query Params:**
- `serverId` (requis): ID du serveur

**Response:**
```json
[
  {
    "id": "service_id",
    "channelName": "🎤 Service",
    "startedAt": "2026-01-31T10:00:00Z",
    "status": "IN_PROGRESS",
    "user": {
      "id": "user_id",
      "username": "Staff#1234",
      "avatar": "hash"
    }
  }
]
```

### GET /services/history
Historique des services d'un utilisateur

**Query Params:**
- `userId` (requis): ID de l'utilisateur
- `serverId` (requis): ID du serveur
- `page` (optionnel): Page
- `limit` (optionnel): Limite par page

### PATCH /services/:id/end
Terminer un service

**Body:**
```json
{
  "notes": "Service terminé avec succès"
}
```

## 📝 Logs

### GET /logs
Récupérer les logs avec filtres

**Query Params:**
- `serverId` (requis): ID du serveur
- `action` (optionnel): Type d'action (LOGIN, VOICE_JOIN, etc.)
- `userId` (optionnel): Filtrer par utilisateur
- `entity` (optionnel): Type d'entité (USER, ROLE, etc.)
- `startDate` (optionnel): Date de début
- `endDate` (optionnel): Date de fin
- `page` (optionnel): Page
- `limit` (optionnel): Limite par page

**Response:**
```json
{
  "logs": [
    {
      "id": "log_id",
      "action": "VOICE_JOIN",
      "entity": "VOICE",
      "description": "Rejoint le canal vocal Vocal 1",
      "createdAt": "2026-01-31T10:00:00Z",
      "user": {
        "username": "User#1234",
        "avatar": "hash"
      }
    }
  ],
  "pagination": {...}
}
```

### GET /logs/:id
Récupérer un log par ID

## 👑 Rôles

### GET /roles
Récupérer tous les rôles d'un serveur

**Query Params:**
- `serverId` (requis): ID du serveur

**Response:**
```json
[
  {
    "id": "role_id",
    "name": "Administrateur",
    "color": "FF0000",
    "position": 10,
    "dashboardPermissions": ["MANAGE_ROLES", "VIEW_LOGS"]
  }
]
```

### POST /roles/assign
Attribuer un rôle à un membre

**Body:**
```json
{
  "serverId": "server_id",
  "userId": "user_id",
  "roleId": "role_id"
}
```

### DELETE /roles/remove
Retirer un rôle d'un membre

**Body:**
```json
{
  "serverId": "server_id",
  "userId": "user_id",
  "roleId": "role_id"
}
```

## 📅 Événements

### GET /events
Récupérer les événements d'un serveur

**Query Params:**
- `serverId` (requis): ID du serveur
- `status` (optionnel): SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
- `type` (optionnel): MEETING, SERVICE, TRAINING, etc.

**Response:**
```json
[
  {
    "id": "event_id",
    "title": "Réunion Staff",
    "description": "Réunion hebdomadaire",
    "startAt": "2026-02-01T18:00:00Z",
    "type": "MEETING",
    "status": "SCHEDULED",
    "attendees": [
      {
        "user": {...},
        "response": "ACCEPTED"
      }
    ]
  }
]
```

### POST /events
Créer un événement

**Body:**
```json
{
  "serverId": "server_id",
  "title": "Réunion Staff",
  "description": "Réunion hebdomadaire",
  "startAt": "2026-02-01T18:00:00Z",
  "endAt": "2026-02-01T19:00:00Z",
  "type": "MEETING",
  "attendeeIds": ["user_id_1", "user_id_2"]
}
```

### PUT /events/:id
Mettre à jour un événement

### DELETE /events/:id
Supprimer un événement

### PUT /events/:id/attendees/:userId/response
Mettre à jour la réponse d'un participant

**Body:**
```json
{
  "response": "ACCEPTED" // ACCEPTED, DECLINED, MAYBE, PENDING
}
```

## 🎫 Tickets

### GET /tickets
Récupérer les tickets d'un serveur

**Query Params:**
- `serverId` (requis): ID du serveur
- `status` (optionnel): OPEN, ASSIGNED, IN_PROGRESS, WAITING, CLOSED
- `category` (optionnel): SUPPORT, BUG, FEATURE_REQUEST, etc.

**Response:**
```json
[
  {
    "id": "ticket_id",
    "title": "Problème de connexion",
    "category": "SUPPORT",
    "priority": "HIGH",
    "status": "OPEN",
    "createdBy": {...},
    "assignedTo": {...},
    "createdAt": "2026-01-31T10:00:00Z"
  }
]
```

### POST /tickets
Créer un ticket

**Body:**
```json
{
  "serverId": "server_id",
  "title": "Problème de connexion",
  "description": "Je ne peux pas me connecter...",
  "category": "SUPPORT",
  "priority": "MEDIUM"
}
```

### PUT /tickets/:id/assign
Attribuer un ticket

**Body:**
```json
{
  "assignedToId": "user_id"
}
```

### PUT /tickets/:id/status
Mettre à jour le statut d'un ticket

**Body:**
```json
{
  "status": "CLOSED"
}
```

### POST /tickets/:id/messages
Ajouter un message à un ticket

**Body:**
```json
{
  "content": "Merci pour votre retour..."
}
```

## 🔧 Serveurs

### GET /servers
Récupérer les serveurs de l'utilisateur

**Response:**
```json
[
  {
    "id": "server_id",
    "discordId": "123456789",
    "name": "Mon Serveur",
    "icon": "hash",
    "isActive": true
  }
]
```

### GET /servers/:id
Récupérer un serveur par ID

### GET /servers/:id/config
Récupérer la configuration d'un serveur

**Response:**
```json
{
  "serviceChannelIds": ["channel_id_1", "channel_id_2"],
  "staffRoleIds": ["role_id_1"],
  "adminRoleIds": ["role_id_2"],
  "voiceTracking": true,
  "serviceTracking": true
}
```

### PUT /servers/:id/config
Mettre à jour la configuration d'un serveur

**Body:**
```json
{
  "serviceChannelIds": ["channel_id_1"],
  "voiceTracking": true
}
```

## 👤 Utilisateurs

### GET /users/me
Obtenir l'utilisateur connecté

### GET /users/:id
Obtenir un utilisateur par ID

### GET /users/:id/stats
Obtenir les statistiques d'un utilisateur

**Query Params:**
- `serverId` (requis): ID du serveur

## 🐙 GitHub

### GET /github/repos
Récupérer les repositories de l'utilisateur

**Query Params:**
- `accessToken` (requis): Token d'accès GitHub

### GET /github/issues
Récupérer les issues d'un repository

**Query Params:**
- `owner` (requis): Propriétaire du repo
- `repo` (requis): Nom du repo
- `accessToken` (requis): Token d'accès GitHub

### GET /github/pulls
Récupérer les pull requests d'un repository

### GET /github/commits
Récupérer les commits récents d'un repository

## 📡 WebSocket (Chat)

Namespace: `/chat`

### Events Client → Server

#### join_room
Rejoindre une room de chat
```json
{
  "roomId": "room_id",
  "userId": "user_id"
}
```

#### send_message
Envoyer un message
```json
{
  "roomId": "room_id",
  "userId": "user_id",
  "content": "Hello world"
}
```

#### typing
Utilisateur en train de taper
```json
{
  "roomId": "room_id",
  "userId": "user_id",
  "username": "User#1234"
}
```

### Events Server → Client

#### new_message
Nouveau message reçu
```json
{
  "id": "message_id",
  "content": "Hello world",
  "user": {...},
  "createdAt": "2026-01-31T10:00:00Z"
}
```

#### user_joined
Utilisateur a rejoint la room

#### user_typing
Utilisateur en train de taper

## 🔒 Codes d'erreur HTTP

- `200` : OK
- `201` : Créé
- `400` : Requête invalide
- `401` : Non authentifié
- `403` : Non autorisé
- `404` : Non trouvé
- `429` : Trop de requêtes (rate limiting)
- `500` : Erreur serveur

## 📌 Notes

- Tous les timestamps sont en format ISO 8601 UTC
- Les durées sont en secondes
- La pagination commence à la page 1
- Le rate limiting est de 10 requêtes par minute par défaut
