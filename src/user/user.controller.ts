import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from '../libs/dto/create-user.dto';
import { UpdateUserDto } from '../libs/dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { User } from '../libs/typeorm/user.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('User Manager')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // create(@Body(ValidationPipe) userDto: UserDto) {
  //   return this.userService.create(userDto);
  // }

  @Get()
  @ApiOperation({
    summary: "Round up all the folks who've signed their virtual soul away!",
  })
  findAll() {
    return this.userService.findAll();
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('me/:username')
  // getProfile(@Request() req) {
  //   return req.user;
  // }

  @ApiBearerAuth('Bearer')
  @ApiOperation({
    summary:
      "Who am I? Well, I'm not a mind reader, but I can fetch the current user for you. Ta-da! 🎩✨",
  })
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({
    description:
      'Are you trying to hack my secrets without the secret handshake? Nice try, but no JWT, no entry!',
  })
  @ApiOkResponse({
    description: 'High-five! Your mission? Totally aced it! 🚀',
  })
  @Get('current')
  getProfile(@Request() req: any) {
    const { username } = req.user;
    return this.userService.getCurrentUser(username);
  }

  @Patch('update/:username')
  @ApiBearerAuth('Bearer')
  @ApiOperation({
    summary:
      'Give that user a makeover! Time for an upgrade, like a software spa day. 💻✨',
  })
  @ApiUnauthorizedResponse({
    description:
      'Are you trying to hack my secrets without the secret handshake? Nice try, but no JWT, no entry!',
  })
  @ApiOkResponse({
    description: 'High-five! Your mission? Totally aced it! 🚀',
  })
  @UseGuards(JwtAuthGuard)
  updateCurrentUser(
    @Param('username') username: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(username, updateUserDto);
  }

  @ApiBearerAuth('Bearer')
  @ApiOkResponse({
    description: 'High-five! Your mission? Totally aced it! 🚀',
  })
  @ApiUnauthorizedResponse({
    description:
      'Are you trying to hack my secrets without the secret handshake? Nice try, but no JWT, no entry!',
  })
  @ApiOperation({
    summary:
      "Say goodbye to your digital doppelganger! Confirm only if you're ready to part ways with your virtual twin. 🚀👋",
  })
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:username')
  deleteCurrentUser(@Param('username') username: string) {
    return this.userService.remove(username);
  }
}
