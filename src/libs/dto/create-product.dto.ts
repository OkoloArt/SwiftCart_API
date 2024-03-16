import { ApiProperty } from '@nestjs/swagger';
import { Attribute } from '../interfaces/attribute.interface';
import { Rating } from '../interfaces/rating.interface';
import { Review } from '../interfaces/review.interface';
import { Specification } from '../interfaces/specification.interface';

export class CreateProductDto {
  @ApiProperty() name: string;

  @ApiProperty() description: string;

  @ApiProperty() price: number;

  @ApiProperty() category: string;

  @ApiProperty() quantity: number;

  @ApiProperty() images?: string[];

  @ApiProperty() attributes?: Attribute[];

  @ApiProperty() specifications?: Specification;
}
