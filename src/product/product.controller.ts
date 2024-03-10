import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from '../libs/dto/create-product.dto';
import { UpdateProductDto } from '../libs/dto/update-product.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@ApiBearerAuth('Bearer')
@UseGuards(JwtAuthGuard)
@ApiTags('Product Manager')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({
    summary:
      "Create a new product. Note that only user with the 'SELLER' role can post a new product",
  })
  @ApiUnauthorizedResponse({
    description:
      'Unable to access if the user isn\'t a "SELLER" or missing a JWT ',
  })
  @Post(':userId')
  create(
    @Param('userId') userId: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productService.create(userId, createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get('current/:id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch('current/delete/:id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
