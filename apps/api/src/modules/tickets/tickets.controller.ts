import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { TicketCategory, TicketPriority, TicketStatus } from '@prisma/client';

@ApiTags('tickets')
@Controller('tickets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtenir les tickets d\'un serveur' })
  @ApiQuery({ name: 'serverId', required: true })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'category', required: false })
  async getServerTickets(
    @Query('serverId') serverId: string,
    @Query('status') status?: TicketStatus,
    @Query('category') category?: TicketCategory,
  ) {
    return this.ticketsService.getServerTickets(serverId, { status, category });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un ticket par ID' })
  async getTicketById(@Param('id') ticketId: string) {
    return this.ticketsService.getTicketById(ticketId);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un ticket' })
  async createTicket(@Body() body: any, @GetUser('id') userId: string) {
    return this.ticketsService.createTicket(body.serverId, userId, body);
  }

  @Put(':id/assign')
  @ApiOperation({ summary: 'Attribuer un ticket' })
  async assignTicket(
    @Param('id') ticketId: string,
    @Body() body: { assignedToId: string },
  ) {
    return this.ticketsService.assignTicket(ticketId, body.assignedToId);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Mettre à jour le statut d\'un ticket' })
  async updateTicketStatus(
    @Param('id') ticketId: string,
    @Body() body: { status: TicketStatus },
  ) {
    return this.ticketsService.updateTicketStatus(ticketId, body.status);
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Ajouter un message à un ticket' })
  async addMessage(
    @Param('id') ticketId: string,
    @Body() body: { content: string },
    @GetUser('id') userId: string,
  ) {
    return this.ticketsService.addMessage(ticketId, userId, body.content);
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Obtenir les messages d\'un ticket' })
  async getTicketMessages(@Param('id') ticketId: string) {
    return this.ticketsService.getTicketMessages(ticketId);
  }
}
