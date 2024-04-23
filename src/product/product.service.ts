import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateProductDto } from '../libs/dto/create-product.dto';
import { UpdateProductDto } from '../libs/dto/update-product.dto';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/libs/typeorm/product.entity';
import { User } from 'src/libs/typeorm/user.entity';
import { ReviewProductDto } from 'src/libs/dto/review.dto';
import { Review } from 'src/libs/interfaces/review.interface';
import { calculateAverageRating, totalRatingCount } from 'src/utils';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { UploadImageDto } from 'src/libs/dto/upload-image.dto';
import { SimpleUserInfo } from 'src/libs/interfaces/simple-user-info.interface';
import { map } from 'rxjs';
const sharp = require('sharp');

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async create(
    userId: string,
    createProductDto: CreateProductDto,
    data: UploadImageDto,
  ): Promise<{ status: number; description: string }> {
    const user = await this.userService.findOne(userId);

    const { base64 } = data;

    if (!user.products) {
      user.products = [];
    }

    const imageUrl = await this.uploadProductImage(base64);

    const product = this.productRepo.create(createProductDto);

    product.attributes = product.attributes || [];
    product.specifications = product.specifications || {
      dimensions: { length: 0, width: 0, height: 0 },
      weight: 0,
    };
    product.reviews = product.reviews || [];
    product.ratings = product.ratings || { average: 0, count: 0 };

    user.products.push(product);

    product.images = product.images || [];
    product.images.push(imageUrl);

    await this.productRepo.save(product);
    await this.userRepo.save(user);

    return {
      status: 200,
      description: "Congrats, you've successfully added a Product.",
    };
  }

  async getAllProducts() {
    const products = await this.productRepo.find();

    const mappedProduct = products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        ratings: (product.ratings && product.ratings.average) || 0,
        image: product.images[0],
      };
    });

    return {
      itemCount: products.length,
      products: mappedProduct
    };
  }

  async getProduct(productId: string): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id: productId },
      relations: {
        user: true,
      },
    });

    if (!product) {
      throw new NotFoundException(
        "Oops! Looks like this product is playing hide and seek in our database – it's nowhere to be found!",
      );
    }

    const mappedProduct: Product = {
      ...product,
      user: {
        username: (product.user && product.user.username) || '',
        id: (product.user && product.user.id) || 0,
      } as SimpleUserInfo,
    };

    return mappedProduct;
  }

  async update(productId: string, updateProductDto: UpdateProductDto) {
    const product = await this.getProduct(productId);

    // const { base64 } = data;
    // const imageUrl = await this.uploadProductImage(base64);

    Object.assign(product, updateProductDto);
    return this.productRepo.save(product);
  }

  async remove(userId: string, productId: string) {
    const user = await this.userService.findOne(userId);
    const product = await this.getProduct(productId);

    if (user.username !== product.user.username) {
      throw new ConflictException("You cannot delete that which isn't yours");
    }

    await this.productRepo.remove(product);
    return { message: 'Product was deleted successfully' };
  }

  async addReview(
    userId: string,
    productId: string,
    reviewProductDto: ReviewProductDto,
  ) {
    const { userRating, userComment } = reviewProductDto;
    const user = await this.userService.findOne(userId);
    const product = await this.getProduct(productId);

    if (user.username === product.user.username) {
      throw new ConflictException('You cannot review your product');
    }

    const existingReviewIndex = product.reviews?.findIndex(
      (review) => review.user === user.username,
    );

    if (userRating > 10 || userRating < 0) {
      throw new ConflictException(
        'Rating cannot be more than 10 or less than 0',
      );
    }

    if (existingReviewIndex !== -1) {
      Object.assign(product.reviews[existingReviewIndex], {
        rating: userRating,
        comment: userComment,
      });
    } else {
      const review: Review = {
        user: user.username,
        rating: userRating,
        comment: userComment,
      };
      product.reviews = [...(product.reviews || []), review];
    }

    product.ratings = {
      average: calculateAverageRating(product),
      count: totalRatingCount(product),
    };

    await this.productRepo.save(product);

    return { message: 'Thanks for adding a review' };
  }

  async uploadProductImage(base64: string) {
    try {
      const imageData = await this.fileUploadService.uploadProfilePhoto(
        '',
        base64,
      );

      if (!imageData) throw new Error();

      const { imageUrl, imageKey } = imageData;
      return imageUrl;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('');
    }
  }
}
