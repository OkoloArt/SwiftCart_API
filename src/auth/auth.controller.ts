import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body(ValidationPipe) createUserDto: UserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  login(@Body(ValidationPipe) createUserDto: UserDto) {}
}
