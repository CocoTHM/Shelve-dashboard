import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

/**
 * Gateway WebSocket pour le chat en temps réel
 */
@WebSocketGateway({
  cors: {
    origin: process.env.WEB_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>(); // socketId -> userId

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedUsers.delete(client.id);
  }

  /**
   * Utilisateur rejoint une room
   */
  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() data: { roomId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`room:${data.roomId}`);
    this.connectedUsers.set(client.id, data.userId);

    // Notifie les autres utilisateurs
    client.to(`room:${data.roomId}`).emit('user_joined', {
      userId: data.userId,
    });

    return { success: true };
  }

  /**
   * Utilisateur quitte une room
   */
  @SubscribeMessage('leave_room')
  async handleLeaveRoom(
    @MessageBody() data: { roomId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`room:${data.roomId}`);

    // Notifie les autres utilisateurs
    client.to(`room:${data.roomId}`).emit('user_left', {
      userId: data.userId,
    });

    return { success: true };
  }

  /**
   * Envoie un message
   */
  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() data: { roomId: string; userId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Sauvegarde le message en DB
    const message = await this.chatService.sendMessage(
      data.roomId,
      data.userId,
      data.content,
    );

    // Diffuse le message à tous les utilisateurs de la room
    this.server.to(`room:${data.roomId}`).emit('new_message', message);

    return { success: true, message };
  }

  /**
   * Utilisateur en train de taper
   */
  @SubscribeMessage('typing')
  async handleTyping(
    @MessageBody() data: { roomId: string; userId: string; username: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(`room:${data.roomId}`).emit('user_typing', {
      userId: data.userId,
      username: data.username,
    });
  }

  /**
   * Utilisateur a arrêté de taper
   */
  @SubscribeMessage('stop_typing')
  async handleStopTyping(
    @MessageBody() data: { roomId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(`room:${data.roomId}`).emit('user_stop_typing', {
      userId: data.userId,
    });
  }
}
