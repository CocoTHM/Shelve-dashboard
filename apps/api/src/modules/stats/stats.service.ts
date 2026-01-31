import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Récupère les statistiques globales du dashboard
   */
  async getDashboardStats(serverId: string) {
    // Membres total
    const totalMembers = await this.prisma.serverMember.count({
      where: { serverId },
    });

    // Services en cours (actifs)
    const activeServices = await this.prisma.serviceLog.count({
      where: {
        serverId,
        status: 'IN_PROGRESS',
      },
    });

    // Connexions aujourd'hui (basé sur les logs d'audit)
    const today = startOfDay(new Date());
    const todayConnections = await this.prisma.auditLog.count({
      where: {
        serverId,
        action: 'VOICE_JOIN',
        createdAt: {
          gte: today,
        },
      },
    });

    // Sessions vocales actives
    const activeSessions = await this.prisma.voiceLog.count({
      where: {
        serverId,
        leftAt: null, // Session en cours
      },
    });

    // Top 5 membres par temps vocal (cette semaine)
    const sevenDaysAgo = subDays(new Date(), 7);
    const topMembers = await this.prisma.$queryRaw`
      SELECT 
        u.id,
        u.username,
        u.avatar,
        SUM(COALESCE(v.duration, 0)) as total_time
      FROM users u
      INNER JOIN voice_logs v ON u.id = v."userId"
      WHERE v."serverId" = ${serverId}
        AND v."joinedAt" >= ${sevenDaysAgo}
      GROUP BY u.id, u.username, u.avatar
      ORDER BY total_time DESC
      LIMIT 5
    `;

    return {
      totalMembers,
      activeServices,
      todayConnections,
      activeSessions,
      topMembers,
    };
  }

  /**
   * Récupère les données pour les graphiques d'activité
   */
  async getActivityGraphData(serverId: string, days: number = 7) {
    const startDate = subDays(new Date(), days);

    // Activité journalière (connexions vocales par jour)
    const dailyActivity = await this.prisma.$queryRaw<any[]>`
      SELECT 
        DATE(v."joinedAt") as date,
        COUNT(*) as connections,
        COUNT(DISTINCT v."userId") as unique_users
      FROM voice_logs v
      WHERE v."serverId" = ${serverId}
        AND v."joinedAt" >= ${startDate}
      GROUP BY DATE(v."joinedAt")
      ORDER BY date ASC
    `;

    // Format des données pour le graphique
    const formattedData = dailyActivity.map((day) => ({
      date: format(new Date(day.date), 'dd/MM'),
      connections: Number(day.connections),
      uniqueUsers: Number(day.unique_users),
    }));

    return formattedData;
  }

  /**
   * Récupère les statistiques de présence
   */
  async getPresenceStats(serverId: string) {
    // Cette méthode nécessiterait l'intégration avec le bot Discord
    // pour récupérer les présences en temps réel
    // Pour l'instant, retourne des données mockées

    return {
      online: 0,
      idle: 0,
      dnd: 0,
      offline: 0,
    };
  }

  /**
   * Récupère les statistiques de service
   */
  async getServiceStats(serverId: string) {
    const today = startOfDay(new Date());
    const sevenDaysAgo = subDays(new Date(), 7);

    // Services aujourd'hui
    const todayServices = await this.prisma.serviceLog.count({
      where: {
        serverId,
        startedAt: {
          gte: today,
        },
      },
    });

    // Services cette semaine
    const weekServices = await this.prisma.serviceLog.count({
      where: {
        serverId,
        startedAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    // Temps total de service cette semaine (en secondes)
    const weekServiceTime = await this.prisma.serviceLog.aggregate({
      where: {
        serverId,
        startedAt: {
          gte: sevenDaysAgo,
        },
        status: 'COMPLETED',
      },
      _sum: {
        duration: true,
      },
    });

    // Staff le plus actif cette semaine
    const topStaff = await this.prisma.$queryRaw`
      SELECT 
        u.id,
        u.username,
        u.avatar,
        COUNT(*) as service_count,
        SUM(COALESCE(s.duration, 0)) as total_time
      FROM users u
      INNER JOIN service_logs s ON u.id = s."userId"
      WHERE s."serverId" = ${serverId}
        AND s."startedAt" >= ${sevenDaysAgo}
      GROUP BY u.id, u.username, u.avatar
      ORDER BY total_time DESC
      LIMIT 5
    `;

    return {
      todayServices,
      weekServices,
      weekServiceTime: weekServiceTime._sum.duration || 0,
      topStaff,
    };
  }
}
