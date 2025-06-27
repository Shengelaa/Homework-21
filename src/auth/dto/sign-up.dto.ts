import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

export class SignUpDto {
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

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}
