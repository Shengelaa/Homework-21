import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { create } from 'domain';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id) {
    return this.usersService.getUserById(Number(id));
  }

  @Post()
  createUser(@Body() CreateUserDto: CreateUserDto) {
    const name = CreateUserDto?.name;
    const lastname = CreateUserDto?.lastname;
    const email = CreateUserDto?.email;
    const phoneNumber = CreateUserDto?.phoneNumber;
    const gender = CreateUserDto?.gender;

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
    return this.usersService.updateUserById(Number(id), updateUserDto);
  }
}
