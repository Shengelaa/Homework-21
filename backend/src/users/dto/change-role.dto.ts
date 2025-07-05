import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ChangeRoleDto {
  @IsNotEmpty()
  @IsString()
  role: string;
  @IsNotEmpty()
  @IsString()
  id: string;
}
