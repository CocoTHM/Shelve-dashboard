import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { UsersService } from '../users/users.service';

/**
 * Interface pour les données utilisateur Discord
 */
export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  email?: string;
  verified?: boolean;
}

/**
 * Interface pour les guilds (serveurs) Discord de l'utilisateur
 */
export interface DiscordGuild {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: string;
}

/**
 * Payload du JWT
 */
export interface JwtPayload {
  sub: string; // User ID
  discordId: string;
  username: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Échange le code Discord contre un access token
   */
  async exchangeCodeForToken(code: string): Promise<string> {
    const data = {
      client_id: this.configService.get('DISCORD_CLIENT_ID'),
      client_secret: this.configService.get('DISCORD_CLIENT_SECRET'),
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.configService.get('DISCORD_REDIRECT_URI'),
    };

    try {
      const response = await axios.post(
        'https://discord.com/api/oauth2/token',
        new URLSearchParams(data),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return response.data.access_token;
    } catch (error) {
      console.error('Error exchanging code for token:', error.response?.data);
      throw new UnauthorizedException('Échec de l\'authentification Discord');
    }
  }

  /**
   * Récupère les informations de l'utilisateur Discord
   */
  async getDiscordUser(accessToken: string): Promise<DiscordUser> {
    try {
      const response = await axios.get('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching Discord user:', error.response?.data);
      throw new UnauthorizedException('Impossible de récupérer les données utilisateur');
    }
  }

  /**
   * Récupère les serveurs Discord de l'utilisateur
   */
  async getDiscordGuilds(accessToken: string): Promise<DiscordGuild[]> {
    try {
      const response = await axios.get('https://discord.com/api/users/@me/guilds', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching Discord guilds:', error.response?.data);
      throw new UnauthorizedException('Impossible de récupérer les serveurs');
    }
  }

  /**
   * Vérifie si l'utilisateur appartient au serveur spécifié
   */
  async verifyServerMembership(
    accessToken: string,
    serverId: string,
  ): Promise<boolean> {
    const guilds = await this.getDiscordGuilds(accessToken);
    return guilds.some((guild) => guild.id === serverId);
  }

  /**
   * Authentifie l'utilisateur avec Discord et retourne un JWT
   */
  async authenticateWithDiscord(code: string, serverId?: string) {
    // 1. Échange le code contre un access token
    const accessToken = await this.exchangeCodeForToken(code);

    // 2. Récupère les infos utilisateur
    const discordUser = await this.getDiscordUser(accessToken);

    // 3. Si un serverId est fourni, vérifie l'appartenance
    if (serverId) {
      const isMember = await this.verifyServerMembership(accessToken, serverId);
      if (!isMember) {
        throw new UnauthorizedException(
          'Vous n\'appartenez pas à ce serveur Discord',
        );
      }
    }

    // 4. Créer ou mettre à jour l'utilisateur en base
    const user = await this.usersService.upsertUser({
      discordId: discordUser.id,
      username: discordUser.username,
      discriminator: discordUser.discriminator,
      avatar: discordUser.avatar,
      email: discordUser.email,
    });

    // 5. Générer le JWT
    const payload: JwtPayload = {
      sub: user.id,
      discordId: user.discordId,
      username: user.username,
    };

    const token = this.jwtService.sign(payload);

    return {
      user,
      token,
      expiresIn: this.configService.get('JWT_EXPIRES_IN', '7d'),
    };
  }

  /**
   * Valide un JWT et retourne le payload
   */
  async validateToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Token invalide ou expiré');
    }
  }

  /**
   * Génère un nouveau JWT pour un utilisateur
   */
  generateToken(userId: string, discordId: string, username: string): string {
    const payload: JwtPayload = {
      sub: userId,
      discordId,
      username,
    };

    return this.jwtService.sign(payload);
  }

  /**
   * Refresh token (génère un nouveau token)
   */
  async refreshToken(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    const payload: JwtPayload = {
      sub: user.id,
      discordId: user.discordId,
      username: user.username,
    };

    return {
      token: this.jwtService.sign(payload),
      expiresIn: this.configService.get('JWT_EXPIRES_IN', '7d'),
    };
  }
}
