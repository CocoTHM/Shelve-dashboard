import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('roles')
@Controller('roles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtenir tous les rôles d\'un serveur' })
  @ApiQuery({ name: 'serverId', required: true })
  async getServerRoles(@Query('serverId') serverId: string) {
    return this.rolesService.getServerRoles(serverId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un rôle par ID' })
  async getRoleById(@Param('id') roleId: string) {
    return this.rolesService.getRoleById(roleId);
  }

  @Post('assign')
  @ApiOperation({ summary: 'Attribuer un rôle à un membre' })
  async assignRole(
    @Body()
    body: {
      serverId: string;
      userId: string;
      roleId: string;
    },
    @GetUser('id') adminUserId: string,
  ) {
    return this.rolesService.assignRole(
      body.serverId,
      body.userId,
      body.roleId,
      adminUserId,
    );
  }

  @Delete('remove')
  @ApiOperation({ summary: 'Retirer un rôle d\'un membre' })
  async removeRole(
    @Body()
    body: {
      serverId: string;
      userId: string;
      roleId: string;
    },
    @GetUser('id') adminUserId: string,
  ) {
    return this.rolesService.removeRole(
      body.serverId,
      body.userId,
      body.roleId,
      adminUserId,
    );
  }
}
