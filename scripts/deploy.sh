#!/bin/bash

# Script de déploiement automatisé pour Vercel et Railway
# Ce script déploie le frontend sur Vercel et le backend sur Railway

set -e  # Arrêter en cas d'erreur

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Script de Déploiement Automatisé       ║${NC}"
echo -e "${BLUE}║   Frontend: Vercel | Backend: Railway    ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════╝${NC}\n"

# Fonction pour vérifier si une commande existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Vérification des CLI nécessaires
echo -e "${YELLOW}📋 Vérification des outils nécessaires...${NC}"

if ! command_exists vercel; then
    echo -e "${RED}❌ Vercel CLI n'est pas installé${NC}"
    echo -e "${YELLOW}Installation de Vercel CLI...${NC}"
    npm install -g vercel
fi

if ! command_exists railway; then
    echo -e "${RED}❌ Railway CLI n'est pas installé${NC}"
    echo -e "${YELLOW}Installation de Railway CLI...${NC}"
    npm install -g @railway/cli
fi

echo -e "${GREEN}✅ Tous les outils sont installés${NC}\n"

# Vérification de l'authentification Railway
if [ "$DEPLOY_BACKEND" = true ]; then
    if ! railway whoami >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Non connecté à Railway${NC}"
        echo -e "${BLUE}Connexion à Railway (sans navigateur)...${NC}"
        railway login --browserless
    else
        echo -e "${GREEN}✅ Déjà connecté à Railway${NC}"
    fi
fi

# Menu de sélection
echo -e "${BLUE}Que souhaitez-vous déployer ?${NC}"
echo "1) Frontend (Vercel) seulement"
echo "2) Backend (Railway) seulement"
echo "3) Frontend + Backend (déploiement complet)"
echo "4) Annuler"
echo ""
read -p "Votre choix (1-4): " choice

case $choice in
    1)
        DEPLOY_FRONTEND=true
        DEPLOY_BACKEND=false
        ;;
    2)
        DEPLOY_FRONTEND=false
        DEPLOY_BACKEND=true
        ;;
    3)
        DEPLOY_FRONTEND=true
        DEPLOY_BACKEND=true
        ;;
    4)
        echo -e "${YELLOW}Déploiement annulé${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}Choix invalide${NC}"
        exit 1
        ;;
esac

# Sélection de l'environnement
echo -e "\n${BLUE}Environnement de déploiement :${NC}"
echo "1) Production"
echo "2) Preview/Staging"
echo ""
read -p "Votre choix (1-2): " env_choice

if [ "$env_choice" = "1" ]; then
    ENV_FLAG="--prod"
    ENV_NAME="production"
else
    ENV_FLAG=""
    ENV_NAME="preview"
fi

echo -e "\n${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}Déploiement en cours...${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}\n"

# Déploiement du Backend sur Railway
if [ "$DEPLOY_BACKEND" = true ]; then
    echo -e "${YELLOW}🚀 Déploiement du Backend (Railway)...${NC}\n"
    
    cd apps/api
    
    # Générer les clients Prisma
    echo -e "${YELLOW}📦 Génération des clients Prisma...${NC}"
    npm run prisma:generate || true
    
    # Déployer sur Railway
    echo -e "${YELLOW}📤 Déploiement sur Railway...${NC}"
    if [ "$env_choice" = "1" ]; then
        railway up --service api
    else
        railway up --service api --environment staging
    fi
    
    # Récupérer l'URL de l'API
    API_URL=$(railway domain --service api 2>/dev/null || echo "")
    
    if [ -n "$API_URL" ]; then
        echo -e "${GREEN}✅ Backend déployé avec succès !${NC}"
        echo -e "${GREEN}🔗 URL de l'API: https://${API_URL}${NC}\n"
    else
        echo -e "${YELLOW}⚠️  Backend déployé, mais impossible de récupérer l'URL automatiquement${NC}"
        echo -e "${YELLOW}Veuillez vérifier sur https://railway.app${NC}\n"
    fi
    
    cd ../..
fi

# Déploiement du Frontend sur Vercel
if [ "$DEPLOY_FRONTEND" = true ]; then
    echo -e "${YELLOW}🚀 Déploiement du Frontend (Vercel)...${NC}\n"
    
    cd apps/web
    
    # Créer le fichier .env.production si les variables sont définies
    if [ -n "$API_URL" ]; then
        echo -e "${YELLOW}📝 Configuration des variables d'environnement...${NC}"
        echo "NEXT_PUBLIC_API_URL=https://${API_URL}/api" > .env.production
        echo "NEXT_PUBLIC_WS_URL=https://${API_URL}" >> .env.production
    fi
    
    # Déployer sur Vercel
    echo -e "${YELLOW}📤 Déploiement sur Vercel...${NC}"
    if [ "$env_choice" = "1" ]; then
        vercel --prod --yes
    else
        vercel --yes
    fi
    
    echo -e "${GREEN}✅ Frontend déployé avec succès !${NC}\n"
    
    cd ../..
fi

# Résumé du déploiement
echo -e "\n${GREEN}╔═══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          Déploiement Terminé !            ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════╝${NC}\n"

echo -e "${BLUE}📊 Résumé du déploiement :${NC}"
echo -e "  • Environnement: ${ENV_NAME}"

if [ "$DEPLOY_BACKEND" = true ]; then
    echo -e "  • Backend (Railway): ${GREEN}✅ Déployé${NC}"
    echo -e "    Dashboard: ${BLUE}https://railway.app${NC}"
fi

if [ "$DEPLOY_FRONTEND" = true ]; then
    echo -e "  • Frontend (Vercel): ${GREEN}✅ Déployé${NC}"
    echo -e "    Dashboard: ${BLUE}https://vercel.com/dashboard${NC}"
fi

echo -e "\n${YELLOW}💡 Conseils :${NC}"
echo -e "  • Vérifiez les logs de déploiement sur les dashboards"
echo -e "  • Configurez les variables d'environnement si nécessaire"
echo -e "  • Exécutez les migrations de base de données si besoin"

if [ "$DEPLOY_BACKEND" = true ]; then
    echo -e "\n${YELLOW}🗄️  Pour exécuter les migrations Prisma :${NC}"
    echo -e "  railway run --service api npm run prisma:migrate"
fi

echo -e "\n${GREEN}🎉 Bon déploiement !${NC}\n"
