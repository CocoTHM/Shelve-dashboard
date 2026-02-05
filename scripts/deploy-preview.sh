#!/bin/bash

# Script de déploiement preview/staging
# Déploie sur les environnements de test

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🔍 Déploiement preview/staging...${NC}\n"

# Backend
echo -e "${YELLOW}Backend (Railway - staging)...${NC}"
cd apps/api
npm run prisma:generate || true
railway up --service api --environment staging
cd ../..

# Frontend
echo -e "${YELLOW}Frontend (Vercel - preview)...${NC}"
cd apps/web
vercel --yes
cd ../..

echo -e "\n${GREEN}✅ Déploiement preview terminé !${NC}\n"
