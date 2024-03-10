import { ApiProperty } from '@nestjs/swagger';
import { Dimension } from './dimension.interface';

export class Specification {
  @ApiProperty()
  dimensions: Dimension;

  @ApiProperty()
  weight: number;
}
