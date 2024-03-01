import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { UserDto } from './create-user.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(
  OmitType(UserDto, ['password']),
) {}

export class PasswordUpdateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
  })
  password: string;
}
