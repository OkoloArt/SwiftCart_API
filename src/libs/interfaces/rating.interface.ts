import { ApiProperty } from '@nestjs/swagger';

export class Rating {
  @ApiProperty()
  average: number;

  @ApiProperty()
  count: number;
}
