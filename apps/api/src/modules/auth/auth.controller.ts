import {
  Controller,
  Get,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Refresh token
   */
  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rafraîchir le token JWT' })
  @ApiResponse({
    status: 200,
    description: 'Token rafraîchi',
    schema: {
      properties: {
        token: { type: 'string' },
        expiresIn: { type: 'string' },
      },
    },
  })
  async refresh(@GetUser('id') userId: string) {
    return this.authService.refreshToken(userId);
  }

  /**
   * Get current user (test endpoint)
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir l\'utilisateur connecté' })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur connecté',
  })
  async getCurrentUser(@GetUser() user: any) {
    return user;
  }

  /**
   * Logout (côté client, supprime le token)
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Déconnexion' })
  @ApiResponse({ status: 200, description: 'Déconnexion réussie' })
  async logout() {
    return { message: 'Déconnecté avec succès' };
  }
}
