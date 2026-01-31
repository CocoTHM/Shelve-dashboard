import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { subDays } from 'date-fns';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Démarre un service
   */
  async startService(
    userId: string,
    serverId: string,
    channelId: string,
    channelName: string,
  ) {
    // Vérifie si un service est déjà en cours pour cet utilisateur
    const existingService = await this.prisma.serviceLog.findFirst({
      where: {
        userId,
        serverId,
        status: 'IN_PROGRESS',
      },
    });

    if (existingService) {
      return existingService;
    }

    return this.prisma.serviceLog.create({
      data: {
        userId,
        serverId,
        channelId,
        channelName,
        startedAt: new Date(),
        status: 'IN_PROGRESS',
      },
    });
  }

  /**
   * Termine un service
   */
  async endService(serviceId: string, notes?: string) {
    const service = await this.prisma.serviceLog.findUnique({
      where: { id: serviceId },
    });

    if (!service || service.status !== 'IN_PROGRESS') {
      return null;
    }

    const now = new Date();
    const duration = Math.floor((now.getTime() - service.startedAt.getTime()) / 1000);

    return this.prisma.serviceLog.update({
      where: { id: serviceId },
      data: {
        endedAt: now,
        duration,
        status: 'COMPLETED',
        notes,
      },
    });
  }

  /**
   * Annule un service
   */
  async cancelService(serviceId: string, reason?: string) {
    return this.prisma.serviceLog.update({
      where: { id: serviceId },
      data: {
        endedAt: new Date(),
        status: 'CANCELLED',
        notes: reason,
      },
    });
  }

  /**
   * Récupère les services actifs d'un serveur
   */
  async getActiveServices(serverId: string) {
    return this.prisma.serviceLog.findMany({
      where: {
        serverId,
        status: 'IN_PROGRESS',
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
      orderBy: { startedAt: 'desc' },
    });
  }

  /**
   * Récupère l'historique des services d'un utilisateur
   */
  async getUserServiceHistory(
    userId: string,
    serverId: string,
    page: number = 1,
    limit: number = 50,
  ) {
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      this.prisma.serviceLog.findMany({
        where: { userId, serverId },
        orderBy: { startedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.serviceLog.count({
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
   * Récupère les statistiques de service d'un utilisateur
   */
  async getUserServiceStats(userId: string, serverId: string, days: number = 7) {
    const startDate = subDays(new Date(), days);

    const logs = await this.prisma.serviceLog.findMany({
      where: {
        userId,
        serverId,
        startedAt: {
          gte: startDate,
        },
        status: 'COMPLETED',
      },
    });

    const totalTime = logs.reduce((acc, log) => acc + (log.duration || 0), 0);
    const serviceCount = logs.length;

    return {
      totalTime,
      serviceCount,
      averageServiceTime: serviceCount > 0 ? Math.floor(totalTime / serviceCount) : 0,
    };
  }

  /**
   * Récupère l'historique complet des services d'un serveur
   */
  async getServerServiceHistory(
    serverId: string,
    page: number = 1,
    limit: number = 50,
  ) {
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      this.prisma.serviceLog.findMany({
        where: { serverId },
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
        orderBy: { startedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.serviceLog.count({
        where: { serverId },
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
}
