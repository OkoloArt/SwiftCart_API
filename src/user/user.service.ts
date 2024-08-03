import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { UserDto } from '../libs/dto/create-user.dto';
import { PasswordUpdateDto, UpdateUserDto } from '../libs/dto/update-user.dto';
import { ILike, Repository } from 'typeorm';
import { User } from '../libs/typeorm/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { FileUploadService } from '../file-upload/file-upload.service';
import { ProfileDto } from '../libs/dto/profile.dto';
import { Product } from '../libs/typeorm/product.entity';
import { NotificationService } from '../notification/notification.service';
import { ProductService } from '../product/product.service';
import { ImageData } from '../libs/interfaces/image-data.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
    private readonly scheduleRegistry: SchedulerRegistry,
    private readonly notificationService: NotificationService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async create(userDto: UserDto): Promise<{ status: number; message: string }> {
    const { email } = userDto;
    const userExists = await this.findUserByEmail(email);

    if (userExists) {
      throw new ConflictException('Email already exists');
    }

    const user = this.userRepo.create(userDto);
    await this.userRepo.save(user);
    return {
      status: 200,
      message: 'User was created successfully',
    };
  }

  async findAll(): Promise<
    Omit<
      User,
      | 'password'
      | 'profile'
      | 'createdAt'
      | 'updatedAt'
      | 'userCart'
      | 'userRole'
    >[]
  > {
    const allUsers = await this.userRepo.find();

    const usersWithoutPasswords = allUsers.map(
      ({
        password,
        profile,
        createdAt,
        updatedAt,
        userCart,
        userRole,
        ...rest
      }) => rest,
    );

    return usersWithoutPasswords;
  }

  async findOne(username: string): Promise<User> {
    const foundUser = await this.userRepo.findOneBy({ username });

    if (!foundUser)
      throw new NotFoundException(
        'Whoopsie! 🧙‍♂️ No magic user here! Stir up some registration potion and join the fun. See you in the enchanted user realm! ✨',
      );

    // const { password, ...rest } = foundUser;

    return foundUser;
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(
        'Whoopsie! 🧙‍♂️ No magic user here! Stir up some registration potion and join the fun. See you in the enchanted user realm! ✨',
      );
    }
    return user;
  }

  async getCurrentUser(userId: string): Promise<Omit<User, 'password'>> {
    const foundUser = await this.userRepo.findOne({ where: { id: userId } });

    if (!foundUser)
      throw new NotFoundException(
        'Whoopsie! 🧙‍♂️ No magic user here! Stir up some registration potion and join the fun. See you in the enchanted user realm! ✨',
      );

    const { password, ...rest } = foundUser;

    return rest;
  }

  async update(
    email: string,
    updateUserDto: UpdateUserDto | PasswordUpdateDto,
  ): Promise<{ message: string; user: Omit<User, 'password'> }> {
    const user = await this.findUserByEmail(email);

    if ('password' in updateUserDto) {
      // Handle password update logic
      user.password = updateUserDto.password;
    } else {
      // Handle non-password update logic
      Object.assign(user, updateUserDto);
    }

    const updatedUser = await this.userRepo.save(user);
    const { password, ...rest } = updatedUser;

    return {
      message: 'User was updated successfully',
      user: rest,
    };
  }

  async remove(
    userId: string,
    id: string,
  ): Promise<{ status: number; message: string }> {
    if (userId !== id) {
      throw new ConflictException("You cannot delete that which isn't yours");
    }

    const userToDelete = await this.getUserById(userId);

    await this.userRepo.remove(userToDelete);
    return {
      status: 200,
      message: 'User was deleted successfully',
    };
  }

  async findUserByEmail(email: string) {
    return this.userRepo.findOneBy({ email: ILike(email) });
  }

  async addToCart(userId: string, productId: string) {
    // Fetch the user from the database
    const user = await this.getUserById(userId);

    // Initialize the user's cart if it doesn't exist
    user.userCart = user.userCart || [];

    // Check if the productId is already in the cart
    if (user.userCart.includes(productId)) {
      return {
        message: 'Product is already in the cart',
      };
    }

    // Add the productId to the cart
    user.userCart.push(productId);

    // Save the user with the updated cart
    await this.userRepo.save(user);

    return {
      message: 'Added successfully',
    };
  }

  async removeFromCart(userId: string, productId: string) {
    const user = await this.getUserById(userId);

    if (!user.userCart || user.userCart.length === 0) {
      throw new Error('User cart is empty');
    }

    const index = user.userCart.findIndex((id) => id === productId);
    if (index === -1) {
      throw new Error('Product not found in user cart');
    }

    user.userCart.splice(index, 1);

    await this.userRepo.save(user);

    return {
      message: 'Removed successfully',
    };
  }

  async getProductsInCart(
    userId: string,
  ): Promise<Product[] | { message: string }> {
    const user = await this.getUserById(userId);
    const product: Product[] = [];

    if (user.userCart === null) {
      return {
        message:
          "Oopsie! Your cart feels a bit lonely. Toss in a product and let's get this shopping party started",
      };
    }

    if (user.userCart.length === 0) {
      return {
        message:
          "Oopsie! Your cart feels a bit lonely. Toss in a product and let's get this shopping party started",
      };
    }

    for (const productId of user.userCart) {
      product.push(await this.productService.getProduct(productId));
    }

    return product;
  }

  async notifyUser(userId: string, shouldNotify: boolean) {
    const user = await this.getUserById(userId);
    const jobName = `${user.username}-notify`;

    if (user.userCart === null) {
      return {
        message:
          "Oopsie! Your cart feels a bit lonely. Toss in a product and let's get this shopping party started",
      };
    }

    if (user.userCart.length === 0) {
      return {
        message:
          "Oopsie! Your cart feels a bit lonely. Toss in a product and let's get this shopping party started",
      };
    }

    if (shouldNotify) {
      const job = new CronJob(`0 0 11 * * *`, async () => {
        console.log(`Sending notification to user: ${userId}`);
        this.notificationService.createNotification({
          userId: user.id,
          message:
            "Items are still in your cart! Ready to buy? Head to checkout whenever you're set. Happy shopping! 🎉",
        });
      });
      this.scheduleRegistry.addCronJob(jobName, job as any);
      job.start();

      return {
        message:
          "User will be notified when there's an outstanding product(s) in cart",
      };
    } else {
      const job = this.scheduleRegistry.getCronJob(jobName);
      if (job) {
        job.stop();
        this.scheduleRegistry.deleteCronJob(jobName);
      } else {
        console.log(`No cron job found with the name: ${jobName}`);
        // Handle this case as per your requirements
      }
      return { message: 'User notification stopped' }; // Return a message here
    }
  }

  async setOrUpdateUserProfile(userId: string, data: ProfileDto) {
    try {
      const user = await this.getUserById(userId);

      let imageData: ImageData;

      // Upload image if it's not null or empty
      if (
        data.image !== '' &&
        data.image !== null &&
        data.image !== undefined
      ) {
        imageData = await this.uploadProfileImage(
          user.profile.imageKey,
          data.image,
        );
      }

      // If user profile doesn't exist, create a new one
      if (!user.profile) {
        user.profile = {
          address: data.address,
          country: data.country,
          mobileNo: Number(data.mobileNo),
          gender: data.gender,
          image: imageData?.imageUrl ?? user.profile.image,
          imageKey: imageData?.imageKey ?? user.profile.imageKey,
        };
      } else {
        // Update user profile with non-null or non-empty values
        user.profile.image = imageData?.imageUrl ?? user.profile.image;
        user.profile.imageKey = imageData?.imageKey ?? user.profile.imageKey;
        user.profile.address = data.address ?? user.profile.address;
        user.profile.country = data.country ?? user.profile.country;
        user.profile.mobileNo = Number(data.mobileNo) ?? user.profile.mobileNo;
        user.profile.gender = data.gender ?? user.profile.gender;
      }

      // Save user profile changes
      await this.userRepo.save(user);

      return {
        status: 200,
        message: 'Profile update was successful',
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update profile');
    }
  }

  async uploadProfileImage(imageKey: string, image: string) {
    const imageData = await this.fileUploadService.uploadProfilePhoto(
      imageKey || '',
      image,
    );

    if (!imageData) throw new Error();

    return imageData;
  }
}
