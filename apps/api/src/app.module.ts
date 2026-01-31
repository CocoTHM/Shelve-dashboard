import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

// Core modules
import { PrismaModule } from './common/prisma/prisma.module';

// Feature modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ServersModule } from './modules/servers/servers.module';
import { StatsModule } from './modules/stats/stats.module';
import { LogsModule } from './modules/logs/logs.module';
import { VoiceModule } from './modules/voice/voice.module';
import { ServicesModule } from './modules/services/services.module';
import { RolesModule } from './modules/roles/roles.module';
import { EventsModule } from './modules/events/events.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { ChatModule } from './modules/chat/chat.module';
import { GithubModule } from './modules/github/github.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { DiscordBotModule } from './modules/discord-bot/discord-bot.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 10, // 10 requests
    }]),

    // Database
    PrismaModule,

    // Discord Bot (démarre automatiquement)
    DiscordBotModule,

    // Feature modules
    AuthModule,
    UsersModule,
    ServersModule,
    StatsModule,
    LogsModule,
    VoiceModule,
    ServicesModule,
    RolesModule,
    EventsModule,
    TicketsModule,
    ChatModule,
    GithubModule,
    NotificationsModule,
  ],
})
export class AppModule {}
