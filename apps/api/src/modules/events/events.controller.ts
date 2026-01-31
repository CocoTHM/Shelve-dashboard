import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EventType, EventStatus, AttendeeResponse } from '@prisma/client';

@ApiTags('events')
@Controller('events')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtenir les événements d\'un serveur' })
  @ApiQuery({ name: 'serverId', required: true })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'type', required: false })
  async getServerEvents(
    @Query('serverId') serverId: string,
    @Query('status') status?: EventStatus,
    @Query('type') type?: EventType,
  ) {
    return this.eventsService.getServerEvents(serverId, { status, type });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un événement par ID' })
  async getEventById(@Param('id') eventId: string) {
    return this.eventsService.getEventById(eventId);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un événement' })
  async createEvent(@Body() body: any) {
    return this.eventsService.createEvent(body.serverId, body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un événement' })
  async updateEvent(@Param('id') eventId: string, @Body() body: any) {
    return this.eventsService.updateEvent(eventId, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un événement' })
  async deleteEvent(@Param('id') eventId: string) {
    return this.eventsService.deleteEvent(eventId);
  }

  @Put(':id/attendees/:userId/response')
  @ApiOperation({ summary: 'Mettre à jour la réponse d\'un participant' })
  async updateAttendeeResponse(
    @Param('id') eventId: string,
    @Param('userId') userId: string,
    @Body() body: { response: AttendeeResponse },
  ) {
    return this.eventsService.updateAttendeeResponse(
      eventId,
      userId,
      body.response,
    );
  }

  @Post(':id/attendees')
  @ApiOperation({ summary: 'Ajouter un participant' })
  async addAttendee(
    @Param('id') eventId: string,
    @Body() body: { userId: string },
  ) {
    return this.eventsService.addAttendee(eventId, body.userId);
  }

  @Delete(':id/attendees/:userId')
  @ApiOperation({ summary: 'Retirer un participant' })
  async removeAttendee(
    @Param('id') eventId: string,
    @Param('userId') userId: string,
  ) {
    return this.eventsService.removeAttendee(eventId, userId);
  }
}
