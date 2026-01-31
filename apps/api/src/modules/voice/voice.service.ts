import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { startOfDay, endOfDay, subDays } from 'date-fns';

@Injectable()
export class VoiceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Démarre une session vocale
   */
  async startSession(
    userId: string,
    serverId: string,
    channelId: string,
    channelName: string,
    states: {
      isDeafened: boolean;
      isMuted: boolean;
      isSelfDeaf: boolean;
      isSelfMute: boolean;
    },
  ) {
    return this.prisma.voiceLog.create({
      data: {
        userId,
        serverId,
        channelId,
        channelName,
        joinedAt: new Date(),
        ...states,
      },
    });
  }

  /**
   * Termine une session vocale
   */
  async endSession(sessionId: string) {
    const session = await this.prisma.voiceLog.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.leftAt) {
      return null;
    }

    const now = new Date();
    const duration = Math.floor((now.getTime() - session.joinedAt.getTime()) / 1000);

    return this.prisma.voiceLog.update({
      where: { id: sessionId },
      data: {
        leftAt: now,
        duration,
      },
    });
  }

  /**
   * Met à jour l'état AFK d'une session
   */
  async updateAfkStatus(
    sessionId: string,
    isDeafened: boolean,
    isMuted: boolean,
    isSelfDeaf: boolean,
    isSelfMute: boolean,
  ) {
    return this.prisma.voiceLog.update({
      where: { id: sessionId },
      data: {
        isDeafened,
        isMuted,
        isSelfDeaf,
        isSelfMute,
      },
    });
  }

  /**
   * Récupère l'historique vocal d'un utilisateur
   */
  async getUserVoiceHistory(
    userId: string,
    serverId: string,
    page: number = 1,
    limit: number = 50,
  ) {
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      this.prisma.voiceLog.findMany({
        where: { userId, serverId },
        orderBy: { joinedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.voiceLog.count({
        where: { userId, serverId },
      }),
    ]);

    return {
      logs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Récupère les statistiques vocales d'un utilisateur
   */
  async getUserVoiceStats(userId: string, serverId: string, days: number = 7) {
    const startDate = subDays(new Date(), days);

    const logs = await this.prisma.voiceLog.findMany({
      where: {
        userId,
        serverId,
        joinedAt: {
          gte: startDate,
        },
      },
    });

    const totalTime = logs.reduce((acc, log) => acc + (log.duration || 0), 0);
    const activeTime = logs.reduce((acc, log) => acc + (log.activeDuration || 0), 0);
    const afkTime = logs.reduce((acc, log) => acc + (log.afkDuration || 0), 0);
    const sessionCount = logs.length;

    return {
      totalTime,
      activeTime,
      afkTime,
      sessionCount,
      averageSessionTime: sessionCount > 0 ? Math.floor(totalTime / sessionCount) : 0,
    };
  }

  /**
   * Récupère les sessions vocales actives d'un serveur
   */
  async getActiveSessions(serverId: string) {
    return this.prisma.voiceLog.findMany({
      where: {
        serverId,
        leftAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
            discriminator: true,
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });
  }

  /**
   * Exporte les données vocales en CSV (retourne les données, le CSV sera généré côté contrôleur)
   */
  async exportVoiceData(serverId: string, startDate: Date, endDate: Date) {
    return this.prisma.voiceLog.findMany({
      where: {
        serverId,
        joinedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            discriminator: true,
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });
  }
}
