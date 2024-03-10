import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Base } from './base.entity';
import { Attribute } from '../interfaces/attribute.interface';
import { Rating } from '../interfaces/rating.interface';
import { Review } from '../interfaces/review.interface';
import { Specification } from '../interfaces/specification.interface';

@Entity()
export class Product extends Base {
  @Column() @ApiProperty() name: string;

  @Column() @ApiProperty() description: string;

  @Column() @ApiProperty() price: number;

  @Column() @ApiProperty() category: string;

  @Column() @ApiProperty() quantity: number;

  @Column({ type: 'jsonb' }) @ApiProperty() images: string[];

  @Column({ type: 'jsonb' }) @ApiProperty() attributes: Attribute[];

  @Column({ type: 'jsonb' }) @ApiProperty() specifications: Specification;

  @Column({ type: 'jsonb' }) @ApiProperty() ratings: Rating;

  @Column({ type: 'jsonb' }) @ApiProperty() reviews: Review[];

  @ManyToOne(() => User, (user) => user.products, { nullable: true })
  user: User;
}
