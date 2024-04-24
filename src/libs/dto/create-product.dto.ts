import { ApiProperty } from '@nestjs/swagger';
import { Attribute } from '../interfaces/attribute.interface';
import { Specification } from '../interfaces/specification.interface';
import { IsNumber, IsObject, IsString } from 'class-validator';
import { UploadImageDto } from './upload-image.dto';

export class CreateProductDto {
  @ApiProperty() @IsString() name: string;

  @ApiProperty() @IsString() description: string;

  @ApiProperty() @IsNumber() price: number;

  @ApiProperty() @IsString() category: string;

  @ApiProperty() @IsNumber() quantity: number;

  @ApiProperty() @IsObject() attributes?: Attribute[];

  @ApiProperty() @IsObject() specifications?: Specification;
}

export class CreateProductWithImageDto {
  @ApiProperty({ type: CreateProductDto })
  createProductDto: CreateProductDto;

  @ApiProperty({ type: UploadImageDto })
  uploadImageDto: UploadImageDto;
}
