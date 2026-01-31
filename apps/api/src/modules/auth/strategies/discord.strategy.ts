import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord';
import { ConfigService } from '@nestjs/config';

/**
 * Stratégie Discord OAuth2
 * Note: Cette stratégie n'est actuellement pas utilisée car nous gérons
 * manuellement le flow OAuth2 dans AuthService pour plus de contrôle.
 * Elle est conservée pour référence et utilisation future.
 */
@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('DISCORD_CLIENT_ID'),
      clientSecret: configService.get('DISCORD_CLIENT_SECRET'),
      callbackURL: configService.get('DISCORD_REDIRECT_URI'),
      scope: ['identify', 'email', 'guilds'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const { id, username, discriminator, avatar, email } = profile;

    const user = {
      discordId: id,
      username,
      discriminator,
      avatar,
      email,
      accessToken,
    };

    done(null, user);
  }
}
