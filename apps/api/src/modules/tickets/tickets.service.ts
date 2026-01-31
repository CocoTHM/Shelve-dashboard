import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { TicketCategory, TicketPriority, TicketStatus } from '@prisma/client';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crée un ticket
   */
  async createTicket(
    serverId: string,
    createdById: string,
    data: {
      title: string;
      description: string;
      category: TicketCategory;
      priority?: TicketPriority;
      tags?: string[];
    },
  ) {
    return this.prisma.ticket.create({
      data: {
        serverId,
        createdById,
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority || 'MEDIUM',
        tags: data.tags || [],
        status: 'OPEN',
      },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
  }

  /**
   * Récupère un ticket par ID
   */
  async getTicketById(ticketId: string) {
    return this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            avatar: true,
            discriminator: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            username: true,
            avatar: true,
            discriminator: true,
          },
        },
        messages: true,
      },
    });
  }

  /**
   * Récupère les tickets d'un serveur
   */
  async getServerTickets(
    serverId: string,
    filters?: {
      status?: TicketStatus;
      category?: TicketCategory;
      priority?: TicketPriority;
      assignedToId?: string;
    },
  ) {
    const where: any = { serverId };

    if (filters?.status) where.status = filters.status;
    if (filters?.category) where.category = filters.category;
    if (filters?.priority) where.priority = filters.priority;
    if (filters?.assignedToId) where.assignedToId = filters.assignedToId;

    return this.prisma.ticket.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Attribue un ticket à un utilisateur
   */
  async assignTicket(ticketId: string, assignedToId: string) {
    return this.prisma.ticket.update({
      where: { id: ticketId },
      data: {
        assignedToId,
        status: 'ASSIGNED',
      },
    });
  }

  /**
   * Met à jour le statut d'un ticket
   */
  async updateTicketStatus(ticketId: string, status: TicketStatus) {
    const data: any = { status };

    if (status === 'CLOSED') {
      data.closedAt = new Date();
    }

    return this.prisma.ticket.update({
      where: { id: ticketId },
      data,
    });
  }

  /**
   * Ajoute un message à un ticket
   */
  async addMessage(ticketId: string, userId: string, content: string) {
    return this.prisma.ticketMessage.create({
      data: {
        ticketId,
        userId,
        content,
      },
    });
  }

  /**
   * Récupère les messages d'un ticket
   */
  async getTicketMessages(ticketId: string) {
    return this.prisma.ticketMessage.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
