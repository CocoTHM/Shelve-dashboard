#!/bin/bash

# Script pour préparer les repositories frontend et backend séparés
# Ce script copie les fichiers nécessaires dans des dossiers séparés

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔═══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Préparation des Repositories Séparés   ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════╝${NC}\n"

CURRENT_DIR=$(pwd)
BACKEND_DIR="${CURRENT_DIR}/../discord-dashboard-backend"
FRONTEND_DIR="${CURRENT_DIR}/../discord-dashboard-frontend"

echo -e "${YELLOW}📦 Création des dossiers...${NC}"

# Créer les dossiers parents
mkdir -p "$BACKEND_DIR"
mkdir -p "$FRONTEND_DIR"

# Copier le backend
echo -e "${YELLOW}📤 Copie du backend...${NC}"
cp -r apps/api/* "$BACKEND_DIR/"
cp apps/api/.gitignore "$BACKEND_DIR/" 2>/dev/null || true

# Ajouter les fichiers de config Railway
echo -e "${YELLOW}⚙️  Ajout des configurations Railway...${NC}"

# Créer .gitignore backend
cat > "$BACKEND_DIR/.gitignore" << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
dist/
build/

# Environment
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*

# Prisma
*.db
*.db-journal
EOF

# Copier le frontend
echo -e "${YELLOW}📤 Copie du frontend...${NC}"
cp -r apps/web/* "$FRONTEND_DIR/"
cp apps/web/.gitignore "$FRONTEND_DIR/" 2>/dev/null || true

# Créer .gitignore frontend
cat > "$FRONTEND_DIR/.gitignore" << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
build/

# Production
dist/

# Environment
.env
.env*.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Vercel
.vercel
EOF

echo -e "\n${GREEN}✅ Repositories préparés !${NC}\n"

echo -e "${BLUE}📁 Structure créée :${NC}"
echo -e "  Backend  : ${YELLOW}$BACKEND_DIR${NC}"
echo -e "  Frontend : ${YELLOW}$FRONTEND_DIR${NC}"

echo -e "\n${YELLOW}📝 Prochaines étapes :${NC}\n"

echo -e "${BLUE}1. Backend (Railway)${NC}"
echo -e "   cd $BACKEND_DIR"
echo -e "   git init"
echo -e "   git add ."
echo -e "   git commit -m \"Initial commit - Backend\""
echo -e "   # Créez un repo GitHub et poussez"
echo -e "   git remote add origin https://github.com/votre-username/discord-dashboard-backend.git"
echo -e "   git push -u origin main"

echo -e "\n${BLUE}2. Frontend (Vercel)${NC}"
echo -e "   cd $FRONTEND_DIR"
echo -e "   git init"
echo -e "   git add ."
echo -e "   git commit -m \"Initial commit - Frontend\""
echo -e "   # Créez un repo GitHub et poussez"
echo -e "   git remote add origin https://github.com/votre-username/discord-dashboard-frontend.git"
echo -e "   git push -u origin main"

echo -e "\n${BLUE}3. Déployer${NC}"
echo -e "   • Backend  : Importez le repo sur Railway (https://railway.app/new)"
echo -e "   • Frontend : Importez le repo sur Vercel (https://vercel.com/new)"

echo -e "\n${GREEN}🎉 C'est prêt !${NC}\n"
