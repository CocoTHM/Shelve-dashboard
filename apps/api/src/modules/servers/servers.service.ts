import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ServersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Récupère les serveurs d'un utilisateur
   */
  async getUserServers(userId: string) {
    const memberships = await this.prisma.serverMember.findMany({
      where: { userId },
      include: {
        server: {
          include: {
            config: true,
          },
        },
        roles: true,
      },
    });

    return memberships.map((m) => m.server);
  }

  /**
   * Récupère un serveur par ID
   */
  async getServerById(serverId: string) {
    return this.prisma.server.findUnique({
      where: { id: serverId },
      include: {
        config: true,
        members: {
          include: {
            user: true,
            roles: true,
          },
        },
        roles: true,
      },
    });
  }

  /**
   * Crée ou met à jour un serveur
   */
  async upsertServer(discordId: string, name: string, icon: string, ownerId: string) {
    return this.prisma.server.upsert({
      where: { discordId },
      update: { name, icon, ownerId },
      create: { discordId, name, icon, ownerId },
    });
  }

  /**
   * Ajoute un membre à un serveur
   */
  async addMember(userId: string, serverId: string, joinedAt: Date, nickname?: string) {
    return this.prisma.serverMember.upsert({
      where: {
        userId_serverId: { userId, serverId },
      },
      update: { nickname },
      create: {
        userId,
        serverId,
        nickname,
        joinedAt,
      },
    });
  }

  /**
   * Récupère la configuration d'un serveur
   */
  async getServerConfig(serverId: string) {
    return this.prisma.serverConfig.findUnique({
      where: { serverId },
    });
  }

  /**
   * Met à jour la configuration d'un serveur
   */
  async updateServerConfig(serverId: string, config: any) {
    return this.prisma.serverConfig.upsert({
      where: { serverId },
      update: config,
      create: {
        serverId,
        ...config,
      },
    });
  }
}
