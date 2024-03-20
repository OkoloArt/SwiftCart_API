import { ApiProperty } from '@nestjs/swagger';

export class ReviewProductDto {
  @ApiProperty()
  userRating: number;

  @ApiProperty()
  userComment: string;
}
