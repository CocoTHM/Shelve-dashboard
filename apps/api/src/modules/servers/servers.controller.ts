import { Controller, Get, Param, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ServersService } from './servers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('servers')
@Controller('servers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ServersController {
  constructor(private readonly serversService: ServersService) {}

  @Get()
  @ApiOperation({ summary: 'Obtenir les serveurs de l\'utilisateur' })
  async getUserServers(@GetUser('id') userId: string) {
    return this.serversService.getUserServers(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un serveur par ID' })
  async getServer(@Param('id') id: string) {
    return this.serversService.getServerById(id);
  }

  @Get(':id/config')
  @ApiOperation({ summary: 'Obtenir la configuration d\'un serveur' })
  async getServerConfig(@Param('id') serverId: string) {
    return this.serversService.getServerConfig(serverId);
  }

  @Put(':id/config')
  @ApiOperation({ summary: 'Mettre à jour la configuration d\'un serveur' })
  async updateServerConfig(
    @Param('id') serverId: string,
    @Body() config: any,
  ) {
    return this.serversService.updateServerConfig(serverId, config);
  }
}
