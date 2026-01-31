import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { EventType, EventStatus, AttendeeResponse } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crée un événement
   */
  async createEvent(
    serverId: string,
    data: {
      title: string;
      description?: string;
      startAt: Date;
      endAt?: Date;
      type: EventType;
      channelId?: string;
      channelName?: string;
      notifyBefore?: number;
      attendeeIds?: string[];
    },
  ) {
    const event = await this.prisma.event.create({
      data: {
        serverId,
        title: data.title,
        description: data.description,
        startAt: data.startAt,
        endAt: data.endAt,
        type: data.type,
        channelId: data.channelId,
        channelName: data.channelName,
        notifyBefore: data.notifyBefore,
        status: 'SCHEDULED',
      },
    });

    // Ajoute les participants
    if (data.attendeeIds && data.attendeeIds.length > 0) {
      await Promise.all(
        data.attendeeIds.map((userId) =>
          this.prisma.eventAttendee.create({
            data: {
              eventId: event.id,
              userId,
              response: 'PENDING',
            },
          }),
        ),
      );
    }

    return this.getEventById(event.id);
  }

  /**
   * Récupère un événement par ID
   */
  async getEventById(eventId: string) {
    return this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        attendees: {
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
  }

  /**
   * Récupère les événements d'un serveur
   */
  async getServerEvents(
    serverId: string,
    filters?: {
      status?: EventStatus;
      type?: EventType;
      startDate?: Date;
      endDate?: Date;
    },
  ) {
    const where: any = { serverId };

    if (filters?.status) where.status = filters.status;
    if (filters?.type) where.type = filters.type;

    if (filters?.startDate || filters?.endDate) {
      where.startAt = {};
      if (filters.startDate) where.startAt.gte = filters.startDate;
      if (filters.endDate) where.startAt.lte = filters.endDate;
    }

    return this.prisma.event.findMany({
      where,
      include: {
        attendees: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: { startAt: 'asc' },
    });
  }

  /**
   * Met à jour un événement
   */
  async updateEvent(eventId: string, data: Partial<any>) {
    return this.prisma.event.update({
      where: { id: eventId },
      data,
    });
  }

  /**
   * Supprime un événement
   */
  async deleteEvent(eventId: string) {
    return this.prisma.event.delete({
      where: { id: eventId },
    });
  }

  /**
   * Met à jour la réponse d'un participant
   */
  async updateAttendeeResponse(
    eventId: string,
    userId: string,
    response: AttendeeResponse,
  ) {
    return this.prisma.eventAttendee.updateMany({
      where: { eventId, userId },
      data: { response },
    });
  }

  /**
   * Ajoute un participant
   */
  async addAttendee(eventId: string, userId: string) {
    return this.prisma.eventAttendee.upsert({
      where: {
        eventId_userId: { eventId, userId },
      },
      update: {},
      create: {
        eventId,
        userId,
        response: 'PENDING',
      },
    });
  }

  /**
   * Retire un participant
   */
  async removeAttendee(eventId: string, userId: string) {
    return this.prisma.eventAttendee.deleteMany({
      where: { eventId, userId },
    });
  }
}
