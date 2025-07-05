import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  lastname: string;
  @IsNotEmpty()
  @IsString()
  email: string;
  @IsNotEmpty()
  @IsNumber()
  phoneNumber: number;
  @IsNotEmpty()
  @IsString()
  gender: string;
  @IsNotEmpty()
  @IsString()
  role: string;
}
