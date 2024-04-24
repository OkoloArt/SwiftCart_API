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
import { CreateProductWithImageDto } from '../libs/dto/create-product.dto';
import { UpdateProductWithImageDto } from '../libs/dto/update-product.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { ReviewProductDto } from 'src/libs/dto/review.dto';
import { Roles } from 'src/libs/utils/role.decorator';
import { ROLE } from 'src/libs/enums/role.enum';
import { RolesGuard } from 'src/auth/guard/role.guard';

@ApiTags('Product Manager')
@UseGuards(RolesGuard)
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
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @Post('add-product')
  @Roles(ROLE.SELLER)
  addProduct(
    @Request() req: any,
    @Body() createProductWithImageDto: CreateProductWithImageDto,
  ) {
    const { id } = req.user;
    const { createProductDto, uploadImageDto } = createProductWithImageDto;
    return this.productService.create(id, createProductDto, uploadImageDto);
  }

  @ApiOperation({
    summary: 'Get the list of all product and the associated user',
  })
  @ApiUnauthorizedResponse({
    description: 'Unable to access if JWT is missing ',
  })
  @Get('all-products')
  @ApiOperation({
    summary: 'Return all product with the associated user',
  })
  @ApiUnauthorizedResponse({
    description: 'Unable to access if the user is missing a JWT ',
  })
  getAllProduct() {
    return this.productService.getAllProducts();
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Return a comprehensive details of a product',
  })
  @ApiUnauthorizedResponse({
    description: 'Unable to access if the user is missing a JWT ',
  })
  @Get('current/:productId')
  getCurrentProduct(@Param('id') productId: string) {
    return this.productService.getProduct(productId);
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @Patch('update/:productId')
  @ApiOperation({
    summary: 'Update current product with new information',
  })
  @ApiUnauthorizedResponse({
    description: 'Unable to access if the user is missing a JWT ',
  })
  updateProduct(
    @Param('id') productId: string,
    @Body() updateProductWithImageDto: UpdateProductWithImageDto,
  ) {
    const { updateProductDto, uploadImageDto } = updateProductWithImageDto;
    return this.productService.update(productId, updateProductDto);
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:productId')
  @ApiOperation({
    summary: 'Delete a product',
  })
  @ApiUnauthorizedResponse({
    description: 'Unable to access if the user is missing a JWT ',
  })
  deleteProduct(@Param('id') productId: string, @Request() req: any) {
    const { username } = req.user;
    return this.productService.remove(username, productId);
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @Post('add-review/:productId')
  @ApiOperation({
    summary:
      "Add reviews such as ratings and comment to a product. only accessible by users with a 'BUYER' role",
  })
  @ApiUnauthorizedResponse({
    description: 'Unable to access if the user is missing a JWT ',
  })
  addProductReview(
    @Param('id') productId: string,
    @Request() req: any,
    @Body() reviewProductDto: ReviewProductDto,
  ) {
    const { username } = req.user;
    return this.productService.addReview(username, productId, reviewProductDto);
  }
}
