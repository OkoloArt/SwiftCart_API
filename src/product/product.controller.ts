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
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  FileTypeValidator,
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
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Product Manager')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // @ApiOperation({
  //   summary:
  //     "Create a new product. Note that only user with the 'SELLER' role can post a new product",
  // })
  // @ApiUnauthorizedResponse({
  //   description:
  //     'Unable to access if the user isn\'t a "SELLER" or missing a JWT ',
  // })
  // @ApiBearerAuth('Bearer')
  // @UseGuards(JwtAuthGuard)
  // @Post('add-product')
  // @UseInterceptors(FileInterceptor('image'))
  // addProduct(
  //   @Request() req: any,
  //   @Body() createProductDto: CreateProductDto,
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [new FileTypeValidator({ fileType: 'image/jpeg' })],
  //     }),
  //   )
  //   image: Express.Multer.File,
  // ) {
  //   const { id } = req.user;
  //   return this.productService.create(id, createProductDto, image);
  // }

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
  getCurrentProduct(@Param('id') productId: number) {
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
    @Param('id') productId: number,
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
  deleteProduct(@Param('id') productId: number) {
    return this.productService.remove(productId);
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @Post('add-review/:productId')
  @ApiOperation({
    summary:
      'Add reviews such as ratings and comment to a product. only accessible by Users with a BUYER role',
  })
  @ApiUnauthorizedResponse({
    description: 'Unable to access if the user is missing a JWT ',
  })
  addProductReview(
    @Param('id') productId: number,
    @Request() req: any,
    @Body() reviewProductDto: ReviewProductDto,
  ) {
    const { id } = req.user;
    return this.productService.addReview(id, productId, reviewProductDto);
  }
}
