import { Injectable, NotAcceptableException } from '@nestjs/common';
import { UserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDto: UserDto) {
    const { password, ...rest } = userDto;

    // Hash the password using bcrypt
    const hashPassword = await bcrypt.hash(password, 10);
    const user = this.userService.create({ ...rest, password: hashPassword });

    return user;
  }

  async login(authCredDto: AuthCredentialDto) {
    const { username, password } = authCredDto;

    const user = await this.userService.findOne(username);
    const userPasswordMatch = await bcrypt.compare(password, user.password);

    if (!userPasswordMatch) {
      throw new NotAcceptableException(
        "Oops, looks like your password is playing hide and seek, but it's not winning! Try again, and let's see if we can outsmart it together!",
      );
    }

    return this.loginToken(user);
  }

  private loginToken(user: User) {
    const payload = {
      username: user.username,
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    return {
      message: 'Login successful',
      access_token: this.jwtService.sign(payload),
    };
  }

  async passwordReset(
    authCredDto: AuthCredentialDto,
  ): Promise<{ success: boolean; message: string }> {
    const { username, password, confirmPassword } = authCredDto;

    if (password !== confirmPassword) {
      throw new NotAcceptableException(
        "Oopsie-daisy! It seems like these passwords are playing hide-and-seek, but they're definitely not a matchy-matchy pair. Let's try that again, shall we? 😄",
      );
    }

    // Hash the password using bcrypt
    const hashPassword = await bcrypt.hash(password, 10);
    await this.userService.updatePassword(username, hashPassword);

    return {
      success: true,
      message: 'Password reset successful',
    };
  }
}
