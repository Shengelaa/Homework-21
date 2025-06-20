import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { create } from 'domain';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserGenderPipe } from './pipes/userGender.pipe';
import { QueryParamsDto } from './dto/pagination-user.dto';

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

  @Get(':id')
  getUserById(@Param('id') id) {
    return this.usersService.getUserById(Number(id));
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    const { name, lastname, email, phoneNumber, gender } = createUserDto;
    const genderPipe = new UserGenderPipe();
    const validatedGender = genderPipe.transform(gender, { type: 'body' });

    return this.usersService.createUser({
      name,
      lastname,
      email,
      phoneNumber,
      gender,
    });
  }

  @Delete(':id')
  deleteUser(@Param('id') id) {
    return this.usersService.deleteUserById(Number(id));
  }

  @Put(':id')
  udpateUser(@Param('id') id, @Body() updateUserDto: UpdateUserDto) {
    const { gender } = updateUserDto;

    const genderPipe = new UserGenderPipe();
    const validatedGender = genderPipe.transform(gender, { type: 'body' });

    return this.usersService.updateUserById(Number(id), updateUserDto);
  }
}
