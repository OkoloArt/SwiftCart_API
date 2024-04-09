import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.provider';
import { NotificationService } from './notification.service';

@Module({
  providers: [NotificationService, SocketGateway],
  exports: [NotificationService],
  imports: [],
})
export class NotificationModule {}
