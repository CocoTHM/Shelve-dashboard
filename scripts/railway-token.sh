#!/bin/bash

# Génère un token Railway pour CI/CD (GitHub Actions, etc.)
# Ce script récupère le token d'authentification pour l'utiliser dans des environnements automatisés

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔═══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Génération Token Railway pour CI/CD    ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════╝${NC}\n"

# Vérifier si connecté
if ! railway whoami >/dev/null 2>&1; then
    echo -e "${RED}❌ Non connecté à Railway${NC}"
    echo -e "${YELLOW}Connexion...${NC}\n"
    railway login --browserless
fi

echo -e "${GREEN}✅ Connecté à Railway${NC}"
railway whoami
echo ""

echo -e "${YELLOW}📝 Pour obtenir votre token Railway :${NC}\n"
echo "1. Allez sur : ${BLUE}https://railway.app/account/tokens${NC}"
echo "2. Cliquez sur 'Create Token'"
echo "3. Donnez-lui un nom (ex: 'GitHub Actions')"
echo "4. Copiez le token (il ne sera plus visible après)"
echo ""

echo -e "${YELLOW}🔐 Configuration GitHub Actions :${NC}\n"
echo "Dans votre repository GitHub :"
echo "  → Settings → Secrets and variables → Actions"
echo "  → New repository secret"
echo "  → Name: ${BLUE}RAILWAY_TOKEN${NC}"
echo "  → Value: ${BLUE}<collez le token>${NC}"
echo ""

echo -e "${YELLOW}💡 Le token peut aussi être utilisé localement :${NC}"
echo "  export RAILWAY_TOKEN=<votre_token>"
echo "  railway up"
echo ""

read -p "Voulez-vous ouvrir la page des tokens dans votre navigateur ? (o/n): " open_browser
if [ "$open_browser" = "o" ]; then
    if command -v open >/dev/null 2>&1; then
        open "https://railway.app/account/tokens"
    elif command -v xdg-open >/dev/null 2>&1; then
        xdg-open "https://railway.app/account/tokens"
    else
        echo -e "${YELLOW}Ouvrez manuellement : https://railway.app/account/tokens${NC}"
    fi
fi

echo -e "\n${GREEN}✅ Guide complet affiché !${NC}\n"
