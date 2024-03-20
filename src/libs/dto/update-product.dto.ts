import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { UploadImageDto } from './upload-image.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class UpdateProductWithImageDto {
  @ApiProperty({ type: UpdateProductDto })
  updateProductDto: UpdateProductDto;

  @ApiProperty({ type: UploadImageDto })
  uploadImageDto: UploadImageDto;
}
