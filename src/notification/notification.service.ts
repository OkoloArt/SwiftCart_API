import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SocketGateway } from './socket.provider';

@Injectable()
export class NotificationService {
  constructor(private readonly socketGateway: SocketGateway) {}

  async createNotification(messageData: string) {
    try {
      this.socketGateway.emitNotification(messageData);
    } catch (error) {
      throw new InternalServerErrorException("Couldn't create notification");
    }
  }
}
