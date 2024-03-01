import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import {
  LoginCredentialDto,
  ResetCredentialDto,
} from './dto/auth-credential.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { PasswordUpdateDto, UpdateUserDto } from 'src/user/dto/update-user.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDto: UserDto) {
    try {
      const { password, ...rest } = userDto;

      // Hash the password using bcrypt
      const hashPassword = await bcrypt.hash(password, 10);
      await this.userService.create({ ...rest, password: hashPassword });

      return rest;
    } catch (error) {
      throw new Error('Failed to register user');
    }
  }

  async login(loginCredDto: LoginCredentialDto) {
    const { username, password } = loginCredDto;

    const user = await this.userService.findOne(username);
    const userPasswordMatch = await bcrypt.compare(password, user.password);

    if (!userPasswordMatch) {
      throw new ConflictException(
        "Oops, looks like your password is playing hide and seek, but it's not winning! Try again, and let's see if we can outsmart it together!",
      );
    }

    const token = this.generateToken(user);
    return {
      message: 'Login successful',
      access_token: token,
    };
  }

  private generateToken(user: User) {
    const payload = {
      username: user.username,
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    return this.jwtService.sign(payload);
  }

  async passwordReset(
    resetCredDto: ResetCredentialDto,
  ): Promise<{ message: string; access_token: string }> {
    const { username, password, confirmPassword } = resetCredDto;

    const user = await this.userService.findOne(username);

    if (password !== confirmPassword) {
      throw new ConflictException(
        "Oopsie-daisy! It seems like these passwords are playing hide-and-seek, but they're definitely not a matchy-matchy pair. Let's try that again, shall we? 😄",
      );
    }

    try {
      // Hash the password using bcrypt
      const hashPassword = await bcrypt.hash(password, 10);
      const updatePassword = {
        password: hashPassword,
      };
      const updateUserDto = plainToClass(PasswordUpdateDto, updatePassword);
      await this.userService.update(username, updateUserDto);
    } catch (error) {
      throw new InternalServerErrorException('Error resetting password');
    }

    const token = this.generateToken(user);
    return {
      message: 'Password reset successful',
      access_token: token,
    };
  }
}
