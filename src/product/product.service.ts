import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
import { Rating } from 'src/libs/interfaces/rating.interface';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { UploadImageDto } from 'src/libs/dto/upload-image.dto';
const sharp = require('sharp');

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
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

    const imageUrl = await this.uploadProductImage(base64);

    const product = this.productRepo.create(createProductDto);
    user.products.push(product);

    product.images.push(imageUrl);

    await this.productRepo.save(product);
    await this.userRepo.save(user);

    return {
      status: 200,
      description: "Congrats, you've successfully added a Product.",
    };
  }

  async getAllProducts() {
    const products = await this.productRepo.find({
      relations: {
        user: true,
      },
    });

    const productWithMappedUser = products.map((product) => {
      return {
        ...product,
        user: {
          name: product.user.username || '',
          id: product.user.id || '',
        },
      };
    });

    return productWithMappedUser;
  }

  async getProduct(productId: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(
        "Oops! Looks like this product is playing hide and seek in our database – it's nowhere to be found!",
      );
    }

    return product;
  }

  async update(
    productId: number,
    updateProductDto: UpdateProductDto,
    data: UploadImageDto,
  ) {
    const product = await this.getProduct(productId);

    const { base64 } = data;

    const imageUrl = await this.uploadProductImage(base64);

    Object.assign(product, updateProductDto);
    product.images.push(imageUrl);
    return this.productRepo.save(product);
  }

  async remove(productId: number) {
    const product = await this.productRepo.findOneBy({ id: productId });
    await this.productRepo.remove(product);
    return true;
  }

  async addReview(
    userId: string,
    productId: number,
    reviewProductDto: ReviewProductDto,
  ) {
    const { userRating, userComment } = reviewProductDto;
    const user = await this.userService.findOne(userId);
    const product = await this.getProduct(productId);

    const review: Review = {
      user: user.username,
      rating: userRating,
      comment: userComment,
    };

    product.reviews.push(review);

    const averageRating = calculateAverageRating(product);
    const totalCount = totalRatingCount(product);

    const rating: Rating = {
      average: averageRating,
      count: totalCount,
    };

    product.ratings = rating;

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
