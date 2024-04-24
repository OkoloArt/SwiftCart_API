import { ConflictException, Injectable } from '@nestjs/common';
import {
  PaymentDto as PaymentDto,
  SubscriptionDto,
} from '../libs/dto/payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ROLE } from '../libs/enums/role.enum';
import { SubscriptionType } from '../libs/enums/subscription.enum';
import { User } from '../libs/typeorm/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly userService: UserService,
  ) {}

  async productPayment(paymentDto: PaymentDto) {
    const { paymentMethod, billingDetails } = paymentDto;

    if (
      !paymentMethod ||
      !billingDetails.name ||
      !billingDetails.address ||
      !billingDetails.country ||
      !billingDetails.postalCode
    ) {
      return {
        message: 'Invalid Payment Details',
      };
    }

    const paymentSuccessful = true;

    if (paymentSuccessful) {
      return {
        message: 'Payment successful',
      };
    } else {
      return {
        message: 'Payment failed',
      };
    }
  }

  async cancelSubscription(userId: string, shouldCancel: boolean) {
    if (shouldCancel) {
      const user = await this.userService.getUserById(userId);
      user.userRole = ROLE.BUYER;
      await this.userRepo.save(user);

      return {
        message: "Congrats, you can no longer enjoy a 'SELLER' benefits",
      };
    } else {
      return {
        message: 'An Error occured when trying to cancel your subscription',
      };
    }
  }

  async subscribeSeller(userId: string, subscriptionDto: SubscriptionDto) {
    const { plan, paymentMethod, billingDetails } = subscriptionDto;

    if (
      plan !== SubscriptionType.PREMIUM ||
      !paymentMethod ||
      !billingDetails.name ||
      !billingDetails.address ||
      !billingDetails.country ||
      !billingDetails.postalCode
    ) {
      return {
        message: 'Payment was Invalidated',
      };
    }

    const paymentSuccessful = true;

    if (paymentSuccessful) {
      const user = await this.userService.getUserById(userId);
      user.userRole = ROLE.SELLER;
      await this.userRepo.save(user);

      return {
        message: "Congrats, you are now a 'SELLER'",
      };
    } else {
      return {
        message: 'Payment failed',
      };
    }
  }

  async getPriceOfProduct(userId: string): Promise<number> {
    const products = await this.userService.getProductsInCart(userId);
    let totalPrice = 0;

    if (Array.isArray(products)) {
      for (const product of products) {
        totalPrice += product.price;
      }
    }

    return totalPrice;
  }
}
