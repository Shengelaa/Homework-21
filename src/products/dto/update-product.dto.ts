import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  price: number;

  name: string;

  category: string;

  description: string;
}
