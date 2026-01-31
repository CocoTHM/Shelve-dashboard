import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { VoiceService } from './voice.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('voice')
@Controller('voice')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}

  @Get('history')
  @ApiOperation({ summary: 'Obtenir l\'historique vocal d\'un utilisateur' })
  @ApiQuery({ name: 'userId', required: true })
  @ApiQuery({ name: 'serverId', required: true })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getHistory(
    @Query('userId') userId: string,
    @Query('serverId') serverId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.voiceService.getUserVoiceHistory(
      userId,
      serverId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 50,
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtenir les statistiques vocales d\'un utilisateur' })
  @ApiQuery({ name: 'userId', required: true })
  @ApiQuery({ name: 'serverId', required: true })
  @ApiQuery({ name: 'days', required: false })
  async getStats(
    @Query('userId') userId: string,
    @Query('serverId') serverId: string,
    @Query('days') days?: string,
  ) {
    return this.voiceService.getUserVoiceStats(
      userId,
      serverId,
      days ? parseInt(days, 10) : 7,
    );
  }

  @Get('active')
  @ApiOperation({ summary: 'Obtenir les sessions vocales actives' })
  @ApiQuery({ name: 'serverId', required: true })
  async getActiveSessions(@Query('serverId') serverId: string) {
    return this.voiceService.getActiveSessions(serverId);
  }

  @Get('export')
  @ApiOperation({ summary: 'Exporter les données vocales' })
  @ApiQuery({ name: 'serverId', required: true })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  async exportData(
    @Query('serverId') serverId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const data = await this.voiceService.exportVoiceData(
      serverId,
      new Date(startDate),
      new Date(endDate),
    );

    // Formater en CSV
    const csvRows = [
      'Username,Channel,Joined,Left,Duration (seconds),Active Time,AFK Time',
      ...data.map((log) =>
        [
          `${log.user.username}#${log.user.discriminator}`,
          log.channelName,
          log.joinedAt.toISOString(),
          log.leftAt?.toISOString() || 'En cours',
          log.duration || 0,
          log.activeDuration || 0,
          log.afkDuration || 0,
        ].join(','),
      ),
    ];

    return {
      csv: csvRows.join('\n'),
      filename: `voice_logs_${serverId}_${startDate}_${endDate}.csv`,
    };
  }
}
