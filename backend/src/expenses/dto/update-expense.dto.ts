import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateExpenseDto {
  @IsOptional()
  @IsString()
  category?: string;
  @IsOptional()
  @IsNumber()
  quantity?: number;
  @IsOptional()
  @IsNumber()
  price?: number;
}
