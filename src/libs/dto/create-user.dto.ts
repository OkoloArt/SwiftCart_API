import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
  })
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    type: String,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
  })
  password: string;
}
