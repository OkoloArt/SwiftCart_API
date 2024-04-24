import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { NotificationDto } from '../libs/dto/notification.dto';


@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  emitNotification(@MessageBody() data: NotificationDto) {
    const { userId, message } = data;
    this.server.emit(userId, message);
  }

  afterInit() {
    console.log('Notification Socket Server initialized');
  }

  handleConnection(client: any) {
    console.log(`New Notification socket client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Notification socket client disconnected: ${client.id}`);
  }
}
