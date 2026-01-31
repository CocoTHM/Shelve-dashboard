import { Controller, Get, Post, Patch, Query, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('services')
@Controller('services')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get('active')
  @ApiOperation({ summary: 'Obtenir les services actifs' })
  @ApiQuery({ name: 'serverId', required: true })
  async getActiveServices(@Query('serverId') serverId: string) {
    return this.servicesService.getActiveServices(serverId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Obtenir l\'historique des services d\'un utilisateur' })
  @ApiQuery({ name: 'userId', required: true })
  @ApiQuery({ name: 'serverId', required: true })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getUserHistory(
    @Query('userId') userId: string,
    @Query('serverId') serverId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.servicesService.getUserServiceHistory(
      userId,
      serverId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 50,
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtenir les statistiques de service d\'un utilisateur' })
  @ApiQuery({ name: 'userId', required: true })
  @ApiQuery({ name: 'serverId', required: true })
  @ApiQuery({ name: 'days', required: false })
  async getUserStats(
    @Query('userId') userId: string,
    @Query('serverId') serverId: string,
    @Query('days') days?: string,
  ) {
    return this.servicesService.getUserServiceStats(
      userId,
      serverId,
      days ? parseInt(days, 10) : 7,
    );
  }

  @Get('server-history')
  @ApiOperation({ summary: 'Obtenir l\'historique complet des services du serveur' })
  @ApiQuery({ name: 'serverId', required: true })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getServerHistory(
    @Query('serverId') serverId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.servicesService.getServerServiceHistory(
      serverId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 50,
    );
  }

  @Patch(':id/end')
  @ApiOperation({ summary: 'Terminer un service' })
  async endService(
    @Param('id') serviceId: string,
    @Body() body: { notes?: string },
  ) {
    return this.servicesService.endService(serviceId, body.notes);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Annuler un service' })
  async cancelService(
    @Param('id') serviceId: string,
    @Body() body: { reason?: string },
  ) {
    return this.servicesService.cancelService(serviceId, body.reason);
  }
}
