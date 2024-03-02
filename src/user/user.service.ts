import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserDto } from '../libs/dto/create-user.dto';
import { PasswordUpdateDto, UpdateUserDto } from '../libs/dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from '../libs/typeorm/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(
    userDto: UserDto,
  ): Promise<{ status: number; message: string; user: User }> {
    const { email } = userDto;
    const userExists = await this.findUserByEmail(email);

    if (userExists) {
      throw new ConflictException('Email already exists');
    }

    const user = this.userRepo.create(userDto);
    const newUser = await this.userRepo.save(user);
    return {
      status: 200,
      message: 'User was created successfully',
      user: newUser,
    };
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const allUsers = await this.userRepo.find();

    const usersWithoutPasswords = allUsers.map(({ password, ...rest }) => rest);

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

  async getCurrentUser(username: string): Promise<Omit<User, 'password'>> {
    const foundUser = await this.userRepo.findOneBy({ username });

    if (!foundUser)
      throw new NotFoundException(
        'Whoopsie! 🧙‍♂️ No magic user here! Stir up some registration potion and join the fun. See you in the enchanted user realm! ✨',
      );

    const { password, ...rest } = foundUser;

    return rest;
  }

  async update(
    username: string,
    updateUserDto: UpdateUserDto | PasswordUpdateDto,
  ): Promise<{ message: string; user: Omit<User, 'password'> }> {
    const user = await this.findOne(username);

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
    username: string,
  ): Promise<{ status: boolean; message: string }> {
    const userToDelete = await this.findOne(username);

    await this.userRepo.remove(userToDelete);
    return {
      status: true,
      message: 'User was deleted successfully',
    };
  }

  async findUserByEmail(email: string) {
    return this.userRepo.findOneBy({ email });
  }
}
