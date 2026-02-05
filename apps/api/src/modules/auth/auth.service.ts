import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

/**
 * Payload du JWT
 */
export interface JwtPayload {
  sub: string; // User ID
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
  generateToken(userId: string, username: string): string {
    const payload: JwtPayload = {
      sub: userId,
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
      username: user.username,
    };

    return {
      token: this.jwtService.sign(payload),
      expiresIn: this.configService.get('JWT_EXPIRES_IN', '7d'),
    };
  }
}
