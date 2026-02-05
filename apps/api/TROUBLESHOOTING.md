# 🔧 Guide de Dépannage Railway

## Problèmes Courants et Solutions

### ❌ Erreur : "Build failed"

**Causes possibles :**

1. **Variables d'environnement manquantes**
   - Solution : Vérifiez que `DATABASE_URL` est défini
   - Railway génère automatiquement `DATABASE_URL` si vous ajoutez PostgreSQL

2. **Prisma ne peut pas générer le client**
   ```bash
   # Dans Railway Dashboard → Logs, cherchez :
   "Error: @prisma/client did not initialize yet"
   ```
   - Solution : Vérifiez que le buildCommand inclut `npx prisma generate`

3. **Dépendances manquantes**
   - Solution : Assurez-vous que `package-lock.json` est commité dans git

### ❌ Erreur : "Application failed to respond"

**Causes possibles :**

1. **Port non configuré correctement**
   - Railway expose le port via la variable `PORT`
   - Vérifiez dans `src/main.ts` :
   ```typescript
   const port = process.env.PORT || 3001;
   await app.listen(port, '0.0.0.0'); // Important: '0.0.0.0'
   ```

2. **Base de données non accessible**
   - Vérifiez que PostgreSQL est ajouté au projet
   - Vérifiez les logs : `railway logs`

3. **Migrations non exécutées**
   - Les migrations doivent s'exécuter au démarrage
   - Commande de start : `npx prisma migrate deploy && npm run start:prod`

### ❌ Erreur : "Cannot connect to database"

**Solutions :**

1. **Vérifier la connexion PostgreSQL**
   ```bash
   # Lister les services
   railway service list
   
   # Voir les variables
   railway variables
   ```

2. **DATABASE_URL doit être au format Railway**
   ```
   postgresql://user:password@host:port/database
   ```

3. **Exécuter les migrations manuellement**
   ```bash
   railway run npx prisma migrate deploy
   ```

### ❌ Erreur : "Module not found" en production

**Causes :**
- Dépendances en `devDependencies` au lieu de `dependencies`

**Solution :**
Vérifiez `package.json` :
```json
{
  "dependencies": {
    "@nestjs/common": "^10.3.0",
    "@prisma/client": "^5.8.0",
    // Tous les packages nécessaires en prod
  },
  "devDependencies": {
    "@nestjs/cli": "^10.3.0",
    "typescript": "^5.3.3",
    // Seulement les outils de dev
  }
}
```

### ❌ Health Check Failed

**Causes :**
1. L'endpoint `/api/health` n'existe pas
2. L'application ne démarre pas

**Solutions :**

1. **Créer un endpoint de santé**
   ```typescript
   // src/app.controller.ts
   @Get('health')
   health() {
     return { status: 'ok', timestamp: new Date().toISOString() };
   }
   ```

2. **Ou désactiver le health check dans `railway.json`**
   ```json
   {
     "healthcheckPath": null,
     "healthcheckTimeout": null
   }
   ```

## 🔍 Commandes de Diagnostic

### Voir les logs en temps réel
```bash
railway logs --follow
```

### Tester la connexion DB
```bash
railway run npx prisma db pull
```

### Lister les variables d'environnement
```bash
railway variables
```

### Exécuter une commande dans l'environnement Railway
```bash
railway run npm run prisma:studio
```

### Redéployer
```bash
railway up --detach
```

## ✅ Checklist de Déploiement

Avant de déployer, vérifiez :

- [ ] PostgreSQL est ajouté au projet Railway
- [ ] `DATABASE_URL` est défini automatiquement
- [ ] Variables Discord sont configurées :
  - `DISCORD_CLIENT_ID`
  - `DISCORD_CLIENT_SECRET`
  - `DISCORD_BOT_TOKEN`
  - `DISCORD_REDIRECT_URI`
- [ ] `JWT_SECRET` est défini (générez avec `openssl rand -base64 32`)
- [ ] `CORS_ORIGIN` pointe vers votre frontend Vercel
- [ ] `package-lock.json` est commité dans git
- [ ] Le build local fonctionne : `npm run build`
- [ ] Les migrations locales fonctionnent : `npx prisma migrate dev`

## 🚀 Configuration Recommandée

### Variables Railway Essentielles

```bash
# Automatiques (générées par Railway)
DATABASE_URL=postgresql://...
PORT=auto

# À configurer manuellement
NODE_ENV=production
JWT_SECRET=<généré avec openssl rand -base64 32>
DISCORD_CLIENT_ID=<depuis Discord Developer Portal>
DISCORD_CLIENT_SECRET=<depuis Discord Developer Portal>
DISCORD_BOT_TOKEN=<depuis Discord Developer Portal>
DISCORD_REDIRECT_URI=https://votre-frontend.vercel.app/auth/callback
CORS_ORIGIN=https://votre-frontend.vercel.app
WEB_URL=https://votre-frontend.vercel.app
API_URL=${{RAILWAY_PUBLIC_DOMAIN}}
```

### railway.json Optimisé

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm ci && npx prisma generate && npm run build"
  },
  "deploy": {
    "numReplicas": 1,
    "startCommand": "npx prisma migrate deploy && npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

## 📞 Support

Si le problème persiste :

1. **Vérifier les logs Railway** : `railway logs`
2. **Vérifier la documentation** : https://docs.railway.app
3. **Discord Railway** : https://discord.gg/railway
4. **GitHub Issues** : Ouvrir un ticket avec les logs

## 🔗 Ressources

- [Railway Docs](https://docs.railway.app)
- [NestJS Deployment](https://docs.nestjs.com/deployment)
- [Prisma Railway](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-railway)
