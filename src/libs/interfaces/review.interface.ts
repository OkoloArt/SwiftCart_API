import { ApiProperty } from '@nestjs/swagger';

export class Review {
  @ApiProperty()
  user: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  comment: string;
}
