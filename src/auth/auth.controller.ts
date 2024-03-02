import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/libs/dto/create-user.dto';
import {
  LoginCredentialDto,
  ResetCredentialDto,
} from '../libs/dto/auth-credential.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Authentication Manager')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary:
      "Time to welcome a fresh face to the club – hitting that 'new user' button like it's the coolest party invite in town! 🎉👋",
  })
  @Post('register-user')
  @ApiCreatedResponse({
    description: 'Ta-da! Another user joins the party! 🎉',
  })
  register(@Body(ValidationPipe) userDto: UserDto) {
    return this.authService.register(userDto);
  }

  @ApiOperation({
    summary:
      'Unlocking secrets for the seasoned user ninja and handing them a golden ticket (JWT)! 🎉',
  })
  @Post('login-user')
  @ApiResponse({
    status: 200,
    description:
      "Boom! You're in! Welcome to the land of unicorns and rainbows – success logged!",
  })
  login(@Body(ValidationPipe) loginCredDto: LoginCredentialDto) {
    return this.authService.login(loginCredDto);
  }

  @ApiOperation({
    summary:
      'Helping forgetful users dance back into their accounts with a groovy JWT reset! 🎉🔐',
  })
  @ApiResponse({
    status: 200,
    description:
      'Your password did the limbo dance and came back refreshed! 💃🔒',
  })
  @Post('reset-password')
  resetPassword(@Body(ValidationPipe) resetCredDto: ResetCredentialDto) {
    return this.authService.passwordReset(resetCredDto);
  }
}
