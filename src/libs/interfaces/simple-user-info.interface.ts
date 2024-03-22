import { ApiProperty } from '@nestjs/swagger';
import { User } from '../typeorm/user.entity';

export class SimpleUserInfo extends User {
  @ApiProperty()
  username: string;

  @ApiProperty()
  id: number;
}
