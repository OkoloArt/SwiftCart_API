import { IsDate, IsEmail, IsEmpty, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  @IsEmpty()
  firstName: string;

  @IsString()
  @IsEmpty()
  lastName: string;

  @IsString()
  @IsEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsEmpty()
  userName: string;

  @IsString()
  @IsEmpty()
  password: string;
}
