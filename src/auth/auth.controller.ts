import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body(ValidationPipe) userDto: UserDto) {
    return this.authService.register(userDto);
  }

  @Post('login')
  login(@Body(ValidationPipe) loginDto: LoginDto) {}
}
