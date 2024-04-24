import { Module, forwardRef } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { Product } from '../libs/typeorm/product.entity';
import { User } from '../libs/typeorm/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    FileUploadModule,
    TypeOrmModule.forFeature([Product, User]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
