import { ApiProperty } from '@nestjs/swagger';

export class Dimension {
  @ApiProperty()
  length: number;

  @ApiProperty()
  width: number;

  @ApiProperty()
  height: number;
}
