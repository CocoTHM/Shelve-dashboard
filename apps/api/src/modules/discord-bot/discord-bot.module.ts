import { Module } from '@nestjs/common';
import { DiscordBotService } from './discord-bot.service';
import { VoiceModule } from '../voice/voice.module';
import { ServicesModule } from '../services/services.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [VoiceModule, ServicesModule, LogsModule],
  providers: [DiscordBotService],
  exports: [DiscordBotService],
})
export class DiscordBotModule {}
