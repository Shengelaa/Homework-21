import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private users = [
    {
      id: 1,
      name: 'user 1',
      lastname: 'shengela',
      email: 'shengela@gmail.com',
      phoneNumber: 59999999,
      gender: 'male',
    },
    {
      id: 2,
      name: 'bidzina',
      lastname: 'ivanishvili',
      email: 'bera@gmail.com',
      phoneNumber: 599999999,
      gender: 'female',
    },
  ];

  getAllUsers({ page, take }) {
    if (!page && !take) {
      page = 1;
      take = 30;
    }

    console.log(take);
    const currentPage = page > 0 ? page : 1;
    const pageSize = take > 0 ? take : 10;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedUsers = this.users.slice(startIndex, endIndex);
    console.log(page, take, 'service');
    return paginatedUsers;
  }

  getUserById(id: number) {
    const user = this.users.find((el) => el.id === id);
    if (!user) throw new NotFoundException('User Not Found');
    return user;
  }

  createUser(createUserDto: CreateUserDto) {
    const { name, lastname, email, phoneNumber, gender } = createUserDto;

    const lastId = this.users[this.users.length - 1]?.id || 0;
    const newUser = {
      id: lastId + 1,
      name,
      lastname,
      email,
      phoneNumber,
      gender,
    };

    this.users.push(newUser);

    return 'created successfully';
  }

  deleteUserById(id: number) {
    const index = this.users.findIndex((el) => el.id === id);
    if (index === -1) throw new NotFoundException('User Not Found');

    this.users.splice(index, 1);
    return 'deleted successfully';
  }

  updateUserById(id: number, updateUserDto: UpdateUserDto) {
    const index = this.users.findIndex((el) => el.id === id);
    if (index === -1) throw new NotFoundException('user not found');

    const updateReq: UpdateUserDto = {};
    if (updateUserDto.email) {
      updateReq.email = updateUserDto.email;
    }
    if (updateUserDto.name) {
      updateReq.name = updateUserDto.name;
    }
    if (updateUserDto.lastname) {
      updateReq.lastname = updateUserDto.lastname;
    }

    if (updateUserDto.phoneNumber) {
      updateReq.phoneNumber = updateUserDto.phoneNumber;
    }

    if (updateUserDto.gender) {
      updateReq.gender = updateUserDto.gender;
    }

    this.users[index] = {
      ...this.users[index],
      ...updateReq,
    };

    return 'updated successfully';
  }
}
