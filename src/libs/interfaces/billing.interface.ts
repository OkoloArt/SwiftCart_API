import { ApiProperty } from '@nestjs/swagger';
import { IsPostalCode, IsString } from 'class-validator';

export class BillingDetails {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsPostalCode()
  postalCode: number;
}
