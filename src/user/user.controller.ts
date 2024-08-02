/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  Request,
  ParseBoolPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from '../libs/dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { ProfileDto } from '../libs/dto/profile.dto';

@ApiTags('User Manager')
@Controller('user')
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
    const { sub } = req.user;
    return this.userService.getCurrentUser(sub);
  }

  @Patch('update')
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
    @Request() req: any,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    const { username } = req.user;
    return this.userService.update(username, updateUserDto);
  }

  @Patch('set-update-profile')
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
  setOrUpdateCurrentUserPofile(
    @Request() req: any,
    @Body(ValidationPipe) profileDto: ProfileDto,
  ) {
    const { sub } = req.user;
    return this.userService.setOrUpdateUserProfile(sub, profileDto);
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
  @Delete('delete/:id')
  deleteCurrentUser(@Param('id') userId: string, @Request() req: any) {
    const { sub } = req.user;
    return this.userService.remove(userId, sub);
  }

  @ApiBearerAuth('Bearer')
  @ApiOkResponse({
    description: 'Item secured in your digital shopping chariot! 🛒',
  })
  @ApiUnauthorizedResponse({
    description:
      'Are you trying to hack my secrets without the secret handshake? Nice try, but no JWT, no entry!',
  })
  @ApiOperation({
    summary: 'Toss that treasure into your virtual shopping chariot! 🛒💫',
  })
  @UseGuards(JwtAuthGuard)
  @Get('addToCart/:productId')
  addToCart(@Request() req: any, @Param('productId') productId: string) {
    const { sub } = req.user;
    return this.userService.addToCart(sub, productId);
  }

  @ApiBearerAuth('Bearer')
  @ApiOkResponse({
    description: 'Item removed from your digital shopping chariot! 🛒',
  })
  @ApiUnauthorizedResponse({
    description:
      'Are you trying to hack my secrets without the secret handshake? Nice try, but no JWT, no entry!',
  })
  @ApiOperation({
    summary: 'Toss that treasure away from your virtual shopping chariot! 🛒💫',
  })
  @UseGuards(JwtAuthGuard)
  @Get('removeFromCart/:productId')
  removeFromCart(@Request() req: any, @Param('productId') productId: string) {
    const { sub } = req.user;
    return this.userService.removeFromCart(sub, productId);
  }

  @ApiBearerAuth('Bearer')
  @ApiOkResponse({
    description: 'Stuff in the shopping cart! 🛒',
  })
  @ApiUnauthorizedResponse({
    description:
      'Are you trying to hack my secrets without the secret handshake? Nice try, but no JWT, no entry!',
  })
  @ApiOperation({
    summary:
      "Hey there, want a peek at your cart's loot? Here's the juicy list of goodies waiting for checkout! 🛒✨",
  })
  @UseGuards(JwtAuthGuard)
  @Get('getProductsInCart')
  getProductsInCart(@Request() req: any) {
    const { sub } = req.user;
    return this.userService.getProductsInCart(sub);
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Send Notification',
  })
  @ApiUnauthorizedResponse({
    description:
      'Are you trying to hack my secrets without the secret handshake? Nice try, but no JWT, no entry!',
  })
  @ApiOperation({
    summary: 'Sending notifications when there are items in the cart! 🛒✨',
  })
  @Get('notify-user/:notify')
  async sendNotification(
    @Request() req: any,
    @Param('notify', ParseBoolPipe) shouldNotify: boolean,
  ) {
    // Call the appropriate method in the userService to send notification to user
    const { sub } = req.user;
    return this.userService.notifyUser(sub, shouldNotify);
  }
}
