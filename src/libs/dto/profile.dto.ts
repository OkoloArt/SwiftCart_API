import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEmail, IsEnum, IsPhoneNumber, IsOptional } from "class-validator";
import { GENDER } from "../enums/gender.enum";

export class ProfileDto{

    @IsString()
    @IsOptional()
    @ApiProperty({
      type: String,
    })
    country?: string;
  
    @IsString()
    @IsOptional()
    @ApiProperty({
      type: String,
    })
    address?: string;
  
    @IsPhoneNumber()
    @IsOptional()
    @ApiProperty({
      type: String,
    })
    mobileNo?: string;
  
    @IsString()
    @IsOptional()
    @ApiProperty({
      type: String,
    })
    image?: string;

    @IsEnum(GENDER)
    @IsOptional()
    @ApiProperty()
    gender?: GENDER;
}