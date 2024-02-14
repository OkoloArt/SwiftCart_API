import { IsEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmpty()
  firstName: String;
}
