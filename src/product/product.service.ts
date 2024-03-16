import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../libs/dto/create-product.dto';
import { UpdateProductDto } from '../libs/dto/update-product.dto';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/libs/typeorm/product.entity';
import { User } from 'src/libs/typeorm/user.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly userService: UserService,
  ) {}

  async create(
    userId: string,
    createProductDto: CreateProductDto,
  ): Promise<{ status: number; description: string }> {
    const user = await this.userService.findOne(userId);

    const product = this.productRepo.create(createProductDto);
    user.products = [product];

    await this.productRepo.save(product);
    await this.userRepo.save(user);

    return {
      status: 200,
      description: "Congrats, you've successfully added a Product.",
    };
  }

  async getAllProduct() {
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

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: number) {
    const product = await this.productRepo.findOneBy({ id });
    await this.productRepo.remove(product);
    return true;
  }
}
