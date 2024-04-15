import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentDto, SubscriptionDto } from '../libs/dto/payment.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Payment Manager')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('product')
  productPayment(@Body() createPaymentDto: PaymentDto) {
    return this.paymentService.productPayment(createPaymentDto);
  }

  @Post(':id/subscribe-seller')
  subscribeSeller(
    @Param('id') userId: string,
    @Body() subscriptionDto: SubscriptionDto,
  ) {
    return this.paymentService.subscribeSeller(userId, subscriptionDto);
  }

  @Post(':id/cancel-subscription/:shouldCancel')
  cancelSubscription(
    @Param('id') userId: string,
    @Param('shouldCancel') shouldCancel: boolean,
  ) {
    return this.paymentService.cancelSubscription(userId, shouldCancel);
  }
}
