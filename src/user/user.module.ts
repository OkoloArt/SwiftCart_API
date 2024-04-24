import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../libs/typeorm/user.entity';
import { NotificationModule } from '../notification/notification.module';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { Product } from '../libs/typeorm/product.entity';
import { ProductModule } from '../product/product.module';


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
