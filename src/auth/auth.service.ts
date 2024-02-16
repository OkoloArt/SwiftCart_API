import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signUp(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;

    // Hash the password using bcrypt
    const hashPassword = await bcrypt.hash(password, 10);
    const user = this.userService.create({ ...rest, password: hashPassword });

    return user;
  }

  login() {}
}
