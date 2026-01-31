import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Obtenir l\'utilisateur connecté' })
  @ApiResponse({ status: 200, description: 'Utilisateur connecté' })
  async getCurrentUser(@GetUser() user: any) {
    return user;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un utilisateur par ID' })
  @ApiResponse({ status: 200, description: 'Utilisateur trouvé' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async getUserById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Obtenir les statistiques d\'un utilisateur' })
  @ApiResponse({ status: 200, description: 'Statistiques utilisateur' })
  async getUserStats(
    @Param('id') userId: string,
    @Query('serverId') serverId: string,
  ) {
    return this.usersService.getUserStats(userId, serverId);
  }
}
