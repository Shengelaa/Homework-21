import { IsIn, IsString } from 'class-validator';

export class UpdateUserRoleDto {
  @IsString()
  @IsIn(['admin', 'user'])
  role: 'admin' | 'user';
}
