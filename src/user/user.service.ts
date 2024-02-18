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

  async findOne(username: string): Promise<Omit<User, 'password'>> {
    const foundUser = await this.userRepo.findOneBy({ username });

    if (!foundUser)
      throw new NotFoundException(
        'Whoopsie! 🧙‍♂️ No magic user here! Stir up some registration potion and join the fun. See you in the enchanted user realm! ✨',
      );

    const { password, ...rest } = foundUser;

    return foundUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
