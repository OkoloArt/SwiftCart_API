import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { Product } from './product.entity';
import { ROLE } from '../enums/role.enum';

@Entity()
export class User extends Base {
  @Column() @ApiProperty() firstName: string;

  @Column() @ApiProperty() lastName: string;

  @Column() @ApiProperty() username: string;

  @Column() @ApiProperty() email: string;

  @Column() @ApiProperty() password: string;

  @OneToMany(() => Product, (product) => product.user) products: Product[];

  @Column('jsonb', { nullable: true }) @ApiProperty() userCart: number[];

  @Column('enum', { enum: ROLE, default: ROLE.BUYER }) userRole: ROLE;
}
