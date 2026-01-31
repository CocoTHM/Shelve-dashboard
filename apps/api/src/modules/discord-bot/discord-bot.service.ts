import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, GatewayIntentBits, VoiceState } from 'discord.js';
import { VoiceService } from '../voice/voice.service';
import { ServicesService } from '../services/services.service';
import { LogsService } from '../logs/logs.service';
import { PrismaService } from '../../common/prisma/prisma.service';

/**
 * Service du bot Discord
 * Écoute les événements Discord et met à jour la base de données
 */
@Injectable()
export class DiscordBotService implements OnModuleInit {
  private client: Client;
  private voiceSessions = new Map<string, string>(); // userId -> sessionId
  private serviceSessions = new Map<string, string>(); // userId -> serviceId

  constructor(
    private readonly configService: ConfigService,
    private readonly voiceService: VoiceService,
    private readonly servicesService: ServicesService,
    private readonly logsService: LogsService,
    private readonly prisma: PrismaService,
  ) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
      ],
    });
  }

  async onModuleInit() {
    const token = this.configService.get('DISCORD_BOT_TOKEN');

    if (!token) {
      console.warn('⚠️  DISCORD_BOT_TOKEN non configuré, le bot ne démarrera pas');
      return;
    }

    await this.initializeBot(token);
  }

  private async initializeBot(token: string) {
    this.client.once('ready', () => {
      console.log(`✅ Bot Discord connecté: ${this.client.user?.tag}`);
    });

    // Écoute les changements d'état vocal
    this.client.on('voiceStateUpdate', (oldState, newState) => {
      this.handleVoiceStateUpdate(oldState, newState);
    });

    // Écoute les mises à jour de membres
    this.client.on('guildMemberUpdate', async (oldMember, newMember) => {
      await this.handleMemberUpdate(oldMember, newMember);
    });

    // Connexion
    try {
      await this.client.login(token);
    } catch (error) {
      console.error('❌ Erreur de connexion du bot Discord:', error);
    }
  }

  /**
   * Gère les changements d'état vocal (join/leave/mute/deaf)
   */
  private async handleVoiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
    const userId = newState.member?.user.id;
    if (!userId) return;

    const guildId = newState.guild.id;

    // Récupère le serveur dans la DB
    const server = await this.prisma.server.findUnique({
      where: { discordId: guildId },
      include: { config: true },
    });

    if (!server) return;

    // Récupère l'utilisateur dans la DB
    const user = await this.prisma.user.findUnique({
      where: { discordId: userId },
    });

    if (!user) return;

    // Utilisateur a rejoint un canal vocal
    if (!oldState.channelId && newState.channelId) {
      await this.handleVoiceJoin(user.id, server.id, newState);
    }

    // Utilisateur a quitté un canal vocal
    if (oldState.channelId && !newState.channelId) {
      await this.handleVoiceLeave(user.id, server.id);
    }

    // Utilisateur a changé de canal
    if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
      await this.handleVoiceLeave(user.id, server.id);
      await this.handleVoiceJoin(user.id, server.id, newState);
    }

    // Changement d'état (mute/deaf)
    if (oldState.channelId && newState.channelId && oldState.channelId === newState.channelId) {
      await this.handleVoiceStateChange(user.id, newState);
    }
  }

  /**
   * Utilisateur rejoint un canal vocal
   */
  private async handleVoiceJoin(userId: string, serverId: string, state: VoiceState) {
    const channelId = state.channelId!;
    const channelName = state.channel?.name || 'Unknown';

    // Démarre une session vocale
    const session = await this.voiceService.startSession(
      userId,
      serverId,
      channelId,
      channelName,
      {
        isDeafened: state.deaf || false,
        isMuted: state.mute || false,
        isSelfDeaf: state.selfDeaf || false,
        isSelfMute: state.selfMute || false,
      },
    );

    this.voiceSessions.set(userId, session.id);

    // Log
    await this.logsService.createLog(
      userId,
      serverId,
      'VOICE_JOIN',
      'VOICE',
      channelId,
      `Rejoint le canal vocal ${channelName}`,
    );

    // Vérifie si c'est un canal de service
    const server = await this.prisma.server.findUnique({
      where: { id: serverId },
      include: { config: true },
    });

    if (server?.config?.serviceChannelIds.includes(channelId)) {
      await this.handleServiceStart(userId, serverId, channelId, channelName);
    }
  }

  /**
   * Utilisateur quitte un canal vocal
   */
  private async handleVoiceLeave(userId: string, serverId: string) {
    const sessionId = this.voiceSessions.get(userId);

    if (sessionId) {
      await this.voiceService.endSession(sessionId);
      this.voiceSessions.delete(userId);

      // Log
      await this.logsService.createLog(
        userId,
        serverId,
        'VOICE_LEAVE',
        'VOICE',
        sessionId,
        'Quitté le canal vocal',
      );
    }

    // Termine le service si en cours
    await this.handleServiceEnd(userId);
  }

  /**
   * Changement d'état vocal (mute/deaf)
   */
  private async handleVoiceStateChange(userId: string, state: VoiceState) {
    const sessionId = this.voiceSessions.get(userId);

    if (sessionId) {
      await this.voiceService.updateAfkStatus(
        sessionId,
        state.deaf || false,
        state.mute || false,
        state.selfDeaf || false,
        state.selfMute || false,
      );
    }
  }

  /**
   * Démarre un service
   */
  private async handleServiceStart(
    userId: string,
    serverId: string,
    channelId: string,
    channelName: string,
  ) {
    const service = await this.servicesService.startService(
      userId,
      serverId,
      channelId,
      channelName,
    );

    this.serviceSessions.set(userId, service.id);

    // Log
    await this.logsService.createLog(
      userId,
      serverId,
      'SERVICE_START',
      'SERVICE',
      service.id,
      `Service démarré dans ${channelName}`,
    );
  }

  /**
   * Termine un service
   */
  private async handleServiceEnd(userId: string) {
    const serviceId = this.serviceSessions.get(userId);

    if (serviceId) {
      await this.servicesService.endService(serviceId);
      this.serviceSessions.delete(userId);
    }
  }

  /**
   * Gère les mises à jour de membres (changement de rôles)
   */
  private async handleMemberUpdate(oldMember: any, newMember: any) {
    // Détecte les changements de rôles
    const oldRoles = oldMember.roles.cache.map((r: any) => r.id);
    const newRoles = newMember.roles.cache.map((r: any) => r.id);

    const addedRoles = newRoles.filter((r: string) => !oldRoles.includes(r));
    const removedRoles = oldRoles.filter((r: string) => !newRoles.includes(r));

    if (addedRoles.length > 0 || removedRoles.length > 0) {
      const user = await this.prisma.user.findUnique({
        where: { discordId: newMember.user.id },
      });

      const server = await this.prisma.server.findUnique({
        where: { discordId: newMember.guild.id },
      });

      if (user && server) {
        // Log les changements
        for (const roleId of addedRoles) {
          const role = newMember.guild.roles.cache.get(roleId);
          await this.logsService.createLog(
            user.id,
            server.id,
            'ROLE_ASSIGN',
            'ROLE',
            roleId,
            `Rôle ${role?.name || roleId} attribué`,
          );
        }

        for (const roleId of removedRoles) {
          const role = oldMember.guild.roles.cache.get(roleId);
          await this.logsService.createLog(
            user.id,
            server.id,
            'ROLE_REMOVE',
            'ROLE',
            roleId,
            `Rôle ${role?.name || roleId} retiré`,
          );
        }
      }
    }
  }

  /**
   * Récupère le client Discord (pour utilisation externe)
   */
  getClient(): Client {
    return this.client;
  }
}
