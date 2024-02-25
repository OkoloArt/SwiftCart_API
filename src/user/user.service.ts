import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(userDto: UserDto): Promise<User> {
    const user = this.userRepo.create(userDto);
    return await this.userRepo.save(user);
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
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.findOne(username);
    Object.assign(user, updateUserDto);
    return this.userRepo.save(user);
  }

  async updatePassword(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.findOne(username);
    user.password = password;
    return this.userRepo.save(user);
  }

  async remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
