import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;
  @IsString()
  @IsOptional()
  lastname?: string;
  @IsString()
  @IsOptional()
  email?: string;
  @IsOptional()
  @IsNumber()
  phoneNumber?: number;
  @IsOptional()
  @IsString()
  gender?: string;
}
