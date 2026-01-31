import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crée une room de chat
   */
  async createRoom(serverId: string, name: string, allowedRoleIds: string[], isPrivate: boolean = false) {
    return this.prisma.chatRoom.create({
      data: {
        serverId,
        name,
        allowedRoleIds,
        isPrivate,
      },
    });
  }

  /**
   * Récupère les rooms d'un serveur
   */
  async getServerRooms(serverId: string) {
    return this.prisma.chatRoom.findMany({
      where: { serverId },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Envoie un message
   */
  async sendMessage(roomId: string, userId: string, content: string) {
    return this.prisma.message.create({
      data: {
        roomId,
        userId,
        content,
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
    });
  }

  /**
   * Récupère l'historique des messages d'une room
   */
  async getRoomMessages(roomId: string, limit: number = 50, before?: Date) {
    const where: any = { roomId };

    if (before) {
      where.createdAt = { lt: before };
    }

    return this.prisma.message.findMany({
      where,
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
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Édite un message
   */
  async editMessage(messageId: string, content: string) {
    return this.prisma.message.update({
      where: { id: messageId },
      data: {
        content,
        edited: true,
        editedAt: new Date(),
      },
    });
  }

  /**
   * Supprime un message
   */
  async deleteMessage(messageId: string) {
    return this.prisma.message.delete({
      where: { id: messageId },
    });
  }
}
