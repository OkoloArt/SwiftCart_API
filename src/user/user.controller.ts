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
import { UserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // create(@Body(ValidationPipe) userDto: UserDto) {
  //   return this.userService.create(userDto);
  // }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Get(':username')
  // findOne(@Param('username') username: string) {
  //   return this.userService.findOne(username);
  // }

  @UseGuards(JwtAuthGuard)
  @Get('me/:username')
  getProfile(@Request() req) {
    return req.user;
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('me/:username')
  // getProfile(@Param('username') username: string) {
  //   return this.userService.getCurrentUser(username);
  // }

  @Patch(':id')
  update(
    @Param('id') username: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(username, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') username: string) {
    return this.userService.remove(username);
  }
}
