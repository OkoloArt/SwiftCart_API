import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SocketGateway } from './socket.provider';
import { NotificationDto } from '../libs/dto/notification.dto';


@Injectable()
export class NotificationService {
  constructor(private readonly socketGateway: SocketGateway) {}

  async createNotification(data: NotificationDto) {
    try {
      this.socketGateway.emitNotification(data);
    } catch (error) {
      throw new InternalServerErrorException("Couldn't create notification");
    }
  }
}
