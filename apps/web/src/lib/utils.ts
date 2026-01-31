import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formate une durée en secondes en format lisible
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  
  return `${secs}s`;
}

/**
 * Formate une durée en format complet (heures:minutes:secondes)
 */
export function formatDurationFull(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Retourne l'URL de l'avatar Discord
 */
export function getDiscordAvatarUrl(
  userId: string,
  avatar: string | null,
  size: number = 128
): string {
  if (avatar) {
    return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png?size=${size}`;
  }
  
  // Avatar par défaut Discord
  return `https://cdn.discordapp.com/embed/avatars/${
    parseInt(userId) % 5
  }.png`;
}

/**
 * Formate un nombre avec séparateurs de milliers
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fr-FR').format(num);
}

/**
 * Tronque un texte avec ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Vérifie si une date est aujourd'hui
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Génère une couleur de badge selon le statut
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    online: 'bg-green-500',
    idle: 'bg-yellow-500',
    dnd: 'bg-red-500',
    offline: 'bg-gray-500',
    active: 'bg-blue-500',
    completed: 'bg-green-500',
    pending: 'bg-yellow-500',
    cancelled: 'bg-red-500',
  };
  
  return colors[status.toLowerCase()] || 'bg-gray-500';
}
