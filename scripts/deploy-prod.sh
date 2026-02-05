#!/bin/bash

# Script rapide de déploiement en production
# Déploie automatiquement frontend + backend sans questions

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 Déploiement rapide en production...${NC}\n"

# Backend
echo -e "${YELLOW}Backend (Railway)...${NC}"
cd apps/api
npm run prisma:generate || true
railway up --service api
cd ../..

# Frontend
echo -e "${YELLOW}Frontend (Vercel)...${NC}"
cd apps/web
vercel --prod --yes
cd ../..

echo -e "\n${GREEN}✅ Déploiement terminé !${NC}\n"
