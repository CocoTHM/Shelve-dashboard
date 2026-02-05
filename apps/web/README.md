# Discord Dashboard - Frontend

Frontend Next.js 14 pour le Discord Dashboard avec interface moderne et temps réel.

## 🚀 Déploiement sur Vercel

### Déploiement rapide

1. **Fork ce repository sur GitHub**

2. **Importer sur Vercel**
   - Allez sur https://vercel.com/new
   - Sélectionnez votre repository GitHub
   
3. **Configuration du build**
   ```
   Framework Preset: Next.js
   Root Directory: . (ou apps/web si monorepo)
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Variables d'environnement**
   
   Dans Vercel → Settings → Environment Variables :
   ```
   NEXT_PUBLIC_API_URL=https://votre-backend.up.railway.app/api
   NEXT_PUBLIC_WS_URL=https://votre-backend.up.railway.app
   ```

5. **Déployer**
   - Cliquez sur "Deploy"
   - Vercel construit et déploie automatiquement

### Mises à jour automatiques

Une fois configuré, chaque push sur `main` déploie automatiquement.

**Preview deployments :** Chaque Pull Request crée un déploiement de preview.

## 🛠️ Développement local

```bash
# Installer les dépendances
npm install

# Créer .env.local
cp .env.example .env.local

# Éditer .env.local avec vos URLs
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=http://localhost:3001

# Lancer le serveur de développement
npm run dev
```

L'application sera disponible sur http://localhost:3000

## 📦 Scripts disponibles

```bash
npm run dev      # Développement
npm run build    # Build pour production
npm run start    # Lancer en production
npm run lint     # Linter
```

## 🎨 Technologies

- **Next.js 14** - React framework avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **Radix UI** - Composants accessibles
- **TanStack Query** - Gestion d'état serveur
- **Zustand** - Gestion d'état client
- **Socket.io** - WebSocket temps réel
- **Recharts** - Graphiques
- **Lucide React** - Icônes

## 📁 Structure

```
src/
├── app/                    # App Router Next.js
│   ├── (auth)/            # Routes authentification
│   ├── (dashboard)/       # Routes dashboard (protégées)
│   ├── layout.tsx         # Layout racine
│   └── page.tsx           # Page d'accueil
├── components/
│   ├── layouts/           # Navbar, Sidebar
│   └── ui/                # Composants UI Radix
├── lib/
│   ├── api.ts             # Client API
│   └── utils.ts           # Utilitaires
├── stores/
│   ├── auth-store.ts      # Store authentification
│   └── server-store.ts    # Store serveur sélectionné
└── types/
    └── index.ts           # Types TypeScript
```

## 🔐 Authentification

L'authentification utilise Discord OAuth2 via le backend.

**Flow :**
1. Clic sur "Se connecter" → Redirige vers Discord
2. Autorisation Discord → Callback backend
3. Backend retourne JWT → Stocké dans Zustand
4. Frontend utilise JWT pour les requêtes API

## 🌐 API Backend

Le backend doit être déployé en premier pour obtenir son URL.

- Repository : [lien vers votre repo backend]
- Railway : [URL de production]

## 📝 Variables d'environnement

Créez un fichier `.env.local` :

```env
# URL du backend API
NEXT_PUBLIC_API_URL="http://localhost:3001/api"

# URL WebSocket
NEXT_PUBLIC_WS_URL="http://localhost:3001"
```

**⚠️ Important :** Les variables `NEXT_PUBLIC_*` sont exposées au navigateur.

## 🎨 Personnalisation

### Couleurs

Modifiez `tailwind.config.js` pour changer le thème.

### Composants UI

Les composants sont dans `src/components/ui/` et basés sur Radix UI.

## 🚨 Troubleshooting

### Erreur "Module not found"

```bash
npm install
npm run build
```

### WebSocket ne se connecte pas

Vérifiez que `NEXT_PUBLIC_WS_URL` pointe vers votre backend.

### 404 sur les routes

Next.js App Router utilise des routes basées sur les dossiers. Vérifiez `src/app/`.

## 📱 Progressive Web App (PWA)

Pour activer PWA :

```bash
npm install next-pwa
```

Puis configurez dans `next.config.js`.

## 📄 Licence

MIT
