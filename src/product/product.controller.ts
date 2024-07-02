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
  Logger,
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
import { Roles } from '../auth/decorators/role.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/role.guard';
import { ReviewProductDto } from '../libs/dto/review.dto';
import { ROLE } from '../libs/enums/role.enum';

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
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('add-product')
  @Roles(ROLE.SELLER)
  addProduct(
    @Request() req: any,
    @Body() createProductWithImageDto: CreateProductWithImageDto,
  ) {
    const { sub } = req.user;
    const { createProductDto, uploadImageDto } = createProductWithImageDto;
    return this.productService.create(sub, createProductDto, uploadImageDto);
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
    const { id } = req.user;
    return this.productService.remove(id, productId);
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
