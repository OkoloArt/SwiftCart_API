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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async () => ({
    //     type: 'postgres',
    //     host: env.DB_HOST as any,
    //     port: env.DB_PORT as any,
    //     username: env.DB_USERNAME as any,
    //     password: env.DB_PASSWORD as any,
    //     database: env.DB_NAME as any,
    //     entities,
    //     ssl: {
    //       rejectUnauthorized: true, // You can set this to true in production after configuring SSL correctly
    //     },
    //   }),
    // }),
    UserModule,
    AuthModule,
    ProductModule,
    DatabaseModule,
  ],
  providers: [FileUploadService],
})
export class AppModule {}
