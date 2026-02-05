#!/bin/bash

# Script d'authentification Railway sans navigateur
# Utilise la méthode browserless pour CI/CD ou terminaux

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔═══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Authentification Railway (Browserless) ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════╝${NC}\n"

# Vérifier si déjà connecté
if railway whoami >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Déjà connecté à Railway${NC}"
    railway whoami
    echo ""
    read -p "Se reconnecter ? (o/n): " reconnect
    if [ "$reconnect" != "o" ]; then
        echo -e "${YELLOW}Authentification annulée${NC}"
        exit 0
    fi
fi

echo -e "${YELLOW}🔐 Connexion à Railway sans navigateur...${NC}\n"
echo -e "${BLUE}Instructions :${NC}"
echo "1. Un lien va s'afficher dans le terminal"
echo "2. Ouvrez ce lien dans votre navigateur"
echo "3. Autorisez l'accès Railway CLI"
echo "4. Le token sera automatiquement configuré"
echo ""

# Connexion browserless
railway login --browserless

echo ""
echo -e "${GREEN}✅ Authentification réussie !${NC}"
echo -e "${BLUE}Utilisateur connecté :${NC}"
railway whoami

echo ""
echo -e "${YELLOW}💡 Prochaines étapes :${NC}"
echo "  • railway init - Initialiser un projet"
echo "  • railway link - Lier un projet existant"
echo "  • railway up - Déployer l'application"
echo ""
