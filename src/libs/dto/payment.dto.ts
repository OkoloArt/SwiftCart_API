import { ApiProperty } from '@nestjs/swagger';
import { BillingDetails } from '../interfaces/billing.interface';
import { SubscriptionType } from '../enums/subscription.enum';
import { IsEnum, IsObject, IsString } from 'class-validator';

export class PaymentDto {
  @ApiProperty()
  @IsString()
  paymentMethod: string;

  @ApiProperty()
  @IsObject()
  billingDetails: BillingDetails;
}

export class SubscriptionDto extends PaymentDto {
  @ApiProperty()
  @IsEnum({ default: SubscriptionType.PREMIUM })
  plan: SubscriptionType;
}
