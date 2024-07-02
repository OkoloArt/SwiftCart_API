import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { FileUploadService } from './file-upload/file-upload.service';
import { DatabaseModule } from './database/database.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guard/role.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    ProductModule,
    DatabaseModule,
    ScheduleModule.forRoot(),
    PaymentModule,
  ],
  providers: [FileUploadService],
})
export class AppModule {}
