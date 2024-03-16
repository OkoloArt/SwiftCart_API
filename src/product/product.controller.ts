import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from '../libs/dto/create-product.dto';
import { UpdateProductDto } from '../libs/dto/update-product.dto';
import {
  ApiBearerAuth,
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
  @Post()
  addProduct(@Request() req: any, @Body() createProductDto: CreateProductDto) {
    const { id } = req.user;
    return this.productService.create(id, createProductDto);
  }

  @ApiOperation({
    summary: 'Get the list of all product and the associated user',
  })
  @ApiUnauthorizedResponse({
    description: 'Unable to access if JWT is missing ',
  })
  @Get()
  getAllProduct() {
    return this.productService.getAllProduct();
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
