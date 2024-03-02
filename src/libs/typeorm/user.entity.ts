import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class User extends Base {
  @Column()
  @ApiProperty()
  firstName: string;

  @Column()
  @ApiProperty()
  lastName: string;

  @Column()
  @ApiProperty()
  username: string;

  @Column()
  @ApiProperty()
  email: string;

  @Column()
  @ApiProperty()
  password: string;
}
