import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentDto, SubscriptionDto } from '../libs/dto/payment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@ApiTags('Payment Manager')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('product')
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  productPayment(@Body() createPaymentDto: PaymentDto) {
    return this.paymentService.productPayment(createPaymentDto);
  }

  @Post(':id/subscribe-seller')
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  subscribeSeller(
    @Param('id') userId: string,
    @Body() subscriptionDto: SubscriptionDto,
  ) {
    return this.paymentService.subscribeSeller(userId, subscriptionDto);
  }

  @Post(':id/cancel-subscription/:shouldCancel')
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  cancelSubscription(
    @Param('id') userId: string,
    @Param('shouldCancel') shouldCancel: boolean,
  ) {
    return this.paymentService.cancelSubscription(userId, shouldCancel);
  }
}
