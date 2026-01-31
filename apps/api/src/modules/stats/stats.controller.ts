import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('stats')
@Controller('stats')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Obtenir les statistiques du dashboard' })
  @ApiQuery({ name: 'serverId', required: true })
  async getDashboardStats(@Query('serverId') serverId: string) {
    return this.statsService.getDashboardStats(serverId);
  }

  @Get('activity')
  @ApiOperation({ summary: 'Obtenir les données d\'activité pour graphiques' })
  @ApiQuery({ name: 'serverId', required: true })
  @ApiQuery({ name: 'days', required: false })
  async getActivityGraph(
    @Query('serverId') serverId: string,
    @Query('days') days?: string,
  ) {
    const daysNumber = days ? parseInt(days, 10) : 7;
    return this.statsService.getActivityGraphData(serverId, daysNumber);
  }

  @Get('presence')
  @ApiOperation({ summary: 'Obtenir les statistiques de présence' })
  @ApiQuery({ name: 'serverId', required: true })
  async getPresenceStats(@Query('serverId') serverId: string) {
    return this.statsService.getPresenceStats(serverId);
  }

  @Get('services')
  @ApiOperation({ summary: 'Obtenir les statistiques de service' })
  @ApiQuery({ name: 'serverId', required: true })
  async getServiceStats(@Query('serverId') serverId: string) {
    return this.statsService.getServiceStats(serverId);
  }
}
