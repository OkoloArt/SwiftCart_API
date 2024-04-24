import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentDto, SubscriptionDto } from '../libs/dto/payment.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';


@ApiTags('Payment Manager')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('product')
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Shell out those shiny coins for the treasure trove in your digital chariot! 💰🛒',
  })
  @ApiUnauthorizedResponse({
    description:
      'Are you trying to hack my secrets without the secret handshake? Nice try, but no JWT, no entry!',
  })
  @ApiOperation({
    summary: 'Shell out those shiny coins for the treasure trove in your digital chariot! 💰🛒',
  })
  productPayment(@Body() createPaymentDto: PaymentDto) {
    return this.paymentService.productPayment(createPaymentDto);
  }

  @Post(':id/subscribe-seller')
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Ready to dive into the wild world of selling? Smash that subscribe button and let\'s start wheelin\' and dealin\'! 🚀💰 ',
  })
  @ApiUnauthorizedResponse({
    description:
      'Are you trying to hack my secrets without the secret handshake? Nice try, but no JWT, no entry!',
  })
  @ApiOperation({
    summary: 'Ready to dive into the wild world of selling? Smash that subscribe button and let\'s start wheelin\' and dealin\'! 🚀💰 ',
  })
  subscribeSeller(
    @Param('id') userId: string,
    @Body() subscriptionDto: SubscriptionDto,
  ) {
    return this.paymentService.subscribeSeller(userId, subscriptionDto);
  }

  @Post(':id/cancel-subscription/:cancel')
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Time to break up with your seller subscription! 🚫💸 It\'s not you, it\'s my bank account screaming for mercy! 😂✌️',
  })
  @ApiUnauthorizedResponse({
    description:
      'Are you trying to hack my secrets without the secret handshake? Nice try, but no JWT, no entry!',
  })
  @ApiOperation({
    summary: 'Time to break up with your seller subscription! 🚫💸 It\'s not you, it\'s my bank account screaming for mercy! 😂✌️',
  })
  cancelSubscription(
    @Param('id') userId: string,
    @Param('cancel') cancel: boolean,
  ) {
    return this.paymentService.cancelSubscription(userId, cancel);
  }
}
