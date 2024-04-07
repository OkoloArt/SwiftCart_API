import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { FileUploadService } from './file-upload/file-upload.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from 'process';
import entities from './libs/typeorm';
import { DatabaseModule } from './database/database.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guard/role.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    ProductModule,
    DatabaseModule,
  ],
  providers: [
    FileUploadService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
