import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(userDto: UserDto) {
    const { password, ...rest } = userDto;

    // Hash the password using bcrypt
    const hashPassword = await bcrypt.hash(password, 10);
    const user = this.userService.create({ ...rest, password: hashPassword });

    return user;
  }

  async login(loginDto: LoginDto) {}
}
