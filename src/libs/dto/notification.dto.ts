import { ApiProperty } from '@nestjs/swagger';

export class NotificationDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  message: string;
}
