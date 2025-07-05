import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Headers,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { create } from 'domain';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserGenderPipe } from './pipes/userGender.pipe';
import { QueryParamsDto } from './dto/pagination-user.dto';
import { IsAuthGuard } from 'src/auth/guards/isAuth.guard';
import { User, UserId } from './decorators/user.decorator';
import { UpdateUserRoleDto } from 'src/expenses/dto/update-user-role.dto';
import { ChangeRoleDto } from './dto/change-role.dto';

@UseGuards(IsAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  getAllUsers(@Query() query: QueryParamsDto) {
    const { page, take, gender, email } = query;
    const genderPipe = new UserGenderPipe();
    const validatedGender = genderPipe.transform(gender, { type: 'body' });

    console.log(page, take, 'page and query');
    return this.usersService.getAllUsers({ page, take, gender, email });
  }

  @Post('/upgrade-subscription')
  getUserByEmailAndUpgradeSubscription(@Headers('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email header is required');
    }

    return this.usersService.getUserByEmailAndUpgradeSubscription({ email });
  }
  @Get(':id')
  getUserById(@Param('id') id) {
    return this.usersService.getUserById(id);
  }

  // @Post()
  // createUser(@Body() createUserDto: CreateUserDto) {
  //   const { name, lastname, email, phoneNumber, gender } = createUserDto;
  //   const genderPipe = new UserGenderPipe();
  //   const validatedGender = genderPipe.transform(gender, { type: 'body' });

  //   return this.usersService.createUser({
  //     name,
  //     lastname,
  //     email,
  //     phoneNumber,
  //     gender,
  //   });
  // }

  @Delete(':id')
  deleteUser(@Param('id') id, @UserId() userId: string) {
    return this.usersService.deleteUserById(id, userId);
  }
  @Put('change-role')
  changeRole(@Body() changeRoleDto: ChangeRoleDto) {

    return this.usersService.updateUserRole(changeRoleDto);
  }

  @Put(':id')
  updateUserById(
    @Param('id') id,
    @Body() updateUserDto: UpdateUserDto,
    @UserId() userId: string,
  ) {
    const { gender } = updateUserDto;

    const genderPipe = new UserGenderPipe();
    const validatedGender = genderPipe.transform(gender, { type: 'body' });

    return this.usersService.updateUserById(id, updateUserDto, userId);
  }
}
