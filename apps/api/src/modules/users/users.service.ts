import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

export interface UpsertUserData {
  discordId: string;
  username: string;
  discriminator: string;
  avatar: string;
  email?: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crée ou met à jour un utilisateur
   */
  async upsertUser(data: UpsertUserData) {
    return this.prisma.user.upsert({
      where: { discordId: data.discordId },
      update: {
        username: data.username,
        discriminator: data.discriminator,
        avatar: data.avatar,
        email: data.email,
        lastLoginAt: new Date(),
      },
      create: {
        discordId: data.discordId,
        username: data.username,
        discriminator: data.discriminator,
        avatar: data.avatar,
        email: data.email,
        lastLoginAt: new Date(),
      },
    });
  }

  /**
   * Trouve un utilisateur par son ID
   */
  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        servers: {
          include: {
            server: true,
            roles: true,
          },
        },
      },
    });
  }

  /**
   * Trouve un utilisateur par son Discord ID
   */
  async findByDiscordId(discordId: string) {
    return this.prisma.user.findUnique({
      where: { discordId },
      include: {
        servers: {
          include: {
            server: true,
            roles: true,
          },
        },
      },
    });
  }

  /**
   * Met à jour la date de dernière connexion
   */
  async updateLastLogin(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }

  /**
   * Récupère les statistiques d'un utilisateur sur un serveur
   */
  async getUserStats(userId: string, serverId: string) {
    const member = await this.prisma.serverMember.findUnique({
      where: {
        userId_serverId: { userId, serverId },
      },
      include: {
        user: true,
        roles: true,
      },
    });

    if (!member) {
      throw new NotFoundException('Membre non trouvé sur ce serveur');
    }

    // Statistiques vocales
    const voiceLogs = await this.prisma.voiceLog.findMany({
      where: { userId, serverId },
      orderBy: { joinedAt: 'desc' },
      take: 10,
    });

    const totalVoiceTime = voiceLogs.reduce((acc, log) => acc + (log.duration || 0), 0);

    // Statistiques de service
    const serviceLogs = await this.prisma.serviceLog.findMany({
      where: { userId, serverId },
      orderBy: { startedAt: 'desc' },
      take: 10,
    });

    const totalServiceTime = serviceLogs.reduce((acc, log) => acc + (log.duration || 0), 0);

    return {
      member,
      stats: {
        totalVoiceTime,
        totalServiceTime,
        recentVoiceSessions: voiceLogs,
        recentServiceSessions: serviceLogs,
      },
    };
  }
}
