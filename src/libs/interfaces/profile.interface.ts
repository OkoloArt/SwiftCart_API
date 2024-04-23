import { ApiProperty } from "@nestjs/swagger";
import { GENDER } from "../enums/gender.enum";

  export class Profile {
    @ApiProperty({
      type: String,
    })
    country?: string | null;
  
    @ApiProperty({
      type: String,
    })
    address?: string | null;
  
    @ApiProperty({
      type: Number,
    })
    mobileNo?: number | null;
  
    @ApiProperty({
      nullable: true,
      type: String,
    })
    image?: string;
  
    @ApiProperty({
      nullable: true,
      type: String,
    })
    imageKey?: string;

    @ApiProperty({
        nullable: true,
        type: GENDER,
    })
    gender?: GENDER;
  }
  