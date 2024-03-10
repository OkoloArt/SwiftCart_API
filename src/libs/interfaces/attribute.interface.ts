import { ApiProperty } from '@nestjs/swagger';

export class Attribute {
  @ApiProperty()
  name: string;

  @ApiProperty()
  value: string;
}
