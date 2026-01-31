import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class RolesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logsService: LogsService,
  ) {}

  /**
   * Récupère tous les rôles d'un serveur
   */
  async getServerRoles(serverId: string) {
    return this.prisma.role.findMany({
      where: { serverId },
      orderBy: { position: 'desc' },
    });
  }

  /**
   * Récupère un rôle par ID
   */
  async getRoleById(roleId: string) {
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
      include: {
        members: {
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
        },
      },
    });

    if (!role) {
      throw new NotFoundException('Rôle non trouvé');
    }

    return role;
  }

  /**
   * Attribue un rôle à un membre
   * Vérifie la hiérarchie des rôles avant d'attribuer
   */
  async assignRole(
    serverId: string,
    userId: string,
    roleId: string,
    adminUserId: string,
  ) {
    // Récupère le rôle à attribuer
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException('Rôle non trouvé');
    }

    // Récupère le membre
    const member = await this.prisma.serverMember.findUnique({
      where: {
        userId_serverId: { userId, serverId },
      },
      include: { roles: true },
    });

    if (!member) {
      throw new NotFoundException('Membre non trouvé');
    }

    // TODO: Vérifier la hiérarchie (l'admin doit avoir un rôle supérieur)
    // Cette vérification nécessite de récupérer les rôles de l'admin

    // Ajoute le rôle
    await this.prisma.serverMember.update({
      where: { id: member.id },
      data: {
        roles: {
          connect: { id: roleId },
        },
      },
    });

    // Log l'action
    await this.logsService.createLog(
      adminUserId,
      serverId,
      'ROLE_ASSIGN',
      'ROLE',
      roleId,
      `Rôle ${role.name} attribué à l'utilisateur`,
      { targetUserId: userId },
    );

    return { success: true };
  }

  /**
   * Retire un rôle d'un membre
   */
  async removeRole(
    serverId: string,
    userId: string,
    roleId: string,
    adminUserId: string,
  ) {
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException('Rôle non trouvé');
    }

    const member = await this.prisma.serverMember.findUnique({
      where: {
        userId_serverId: { userId, serverId },
      },
    });

    if (!member) {
      throw new NotFoundException('Membre non trouvé');
    }

    // Retire le rôle
    await this.prisma.serverMember.update({
      where: { id: member.id },
      data: {
        roles: {
          disconnect: { id: roleId },
        },
      },
    });

    // Log l'action
    await this.logsService.createLog(
      adminUserId,
      serverId,
      'ROLE_REMOVE',
      'ROLE',
      roleId,
      `Rôle ${role.name} retiré de l'utilisateur`,
      { targetUserId: userId },
    );

    return { success: true };
  }

  /**
   * Synchronise les rôles Discord avec la base de données
   */
  async syncDiscordRoles(serverId: string, discordRoles: any[]) {
    const operations = discordRoles.map((discordRole) =>
      this.prisma.role.upsert({
        where: {
          serverId_discordId: {
            serverId,
            discordId: discordRole.id,
          },
        },
        update: {
          name: discordRole.name,
          color: discordRole.color?.toString(16) || null,
          position: discordRole.position,
          permissions: BigInt(discordRole.permissions),
        },
        create: {
          serverId,
          discordId: discordRole.id,
          name: discordRole.name,
          color: discordRole.color?.toString(16) || null,
          position: discordRole.position,
          permissions: BigInt(discordRole.permissions),
        },
      }),
    );

    return Promise.all(operations);
  }
}
