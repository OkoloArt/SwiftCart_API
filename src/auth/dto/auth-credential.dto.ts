import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginCredentialDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
  })
  password: string;
}

export class ResetCredentialDto extends LoginCredentialDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
  })
  confirmPassword?: string;
}
