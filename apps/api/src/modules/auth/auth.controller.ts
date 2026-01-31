import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import { LoginDto, CallbackDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint de login Discord
   * Génère l'URL d'autorisation Discord
   */
  @Get('discord')
  @ApiOperation({ summary: 'Obtenir l\'URL d\'autorisation Discord' })
  @ApiResponse({
    status: 200,
    description: 'URL d\'autorisation Discord',
    schema: {
      properties: {
        url: { type: 'string' },
      },
    },
  })
  getDiscordAuthUrl(@Query('serverId') serverId?: string) {
    const clientId = process.env.DISCORD_CLIENT_ID;
    const redirectUri = encodeURIComponent(process.env.DISCORD_REDIRECT_URI);
    const scope = 'identify email guilds';

    let state = '';
    if (serverId) {
      state = `&state=${encodeURIComponent(JSON.stringify({ serverId }))}`;
    }

    const url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}${state}`;

    return { url };
  }

  /**
   * Callback Discord OAuth2
   * Échange le code contre un JWT
   */
  @Post('discord/callback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Callback Discord OAuth2' })
  @ApiResponse({
    status: 200,
    description: 'Authentification réussie',
    schema: {
      properties: {
        user: { type: 'object' },
        token: { type: 'string' },
        expiresIn: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Authentification échouée' })
  async discordCallback(@Body() callbackDto: CallbackDto) {
    const { code, state } = callbackDto;

    let serverId: string | undefined;
    if (state) {
      try {
        const parsedState = JSON.parse(state);
        serverId = parsedState.serverId;
      } catch (error) {
        // State invalide, continuer sans serverId
      }
    }

    return this.authService.authenticateWithDiscord(code, serverId);
  }

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
