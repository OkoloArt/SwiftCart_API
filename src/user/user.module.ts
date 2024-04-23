import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../libs/typeorm/user.entity';
import { ProductModule } from 'src/product/product.module';
import { Product } from 'src/libs/typeorm/product.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { FileUploadModule } from 'src/file-upload/file-upload.module';

@Module({
  imports: [
    NotificationModule,
    FileUploadModule,
    forwardRef(() => ProductModule),
    TypeOrmModule.forFeature([User, Product]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
