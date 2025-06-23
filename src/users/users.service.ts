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
      subscriptionStartDate: '2024-05-23T00:06:36.751Z',
      subscriptionEndDate: '2024-06-23T00:06:36.751Z',
    },
    {
      id: 2,
      name: 'bidzina',
      lastname: 'ivanishvili',
      email: 'bidzinalomia@gmail.com',
      phoneNumber: 599999999,
      gender: 'female',

      subscriptionStartDate: '2025-06-23T00:06:36.751Z',
      subscriptionEndDate: '2025-07-23T00:06:36.751Z',
    },
    {
      id: 3,
      name: 'bera',
      lastname: 'ivanishvili',
      email: 'bera@gmail.com',
      phoneNumber: 599999999,
      gender: 'other',
      subscriptionStartDate: '2025-05-23T00:06:36.751Z',
      subscriptionEndDate: '2025-06-23T00:06:36.751Z',
    },
  ];

  getUserByEmailAndUpgradeSubscription({ email }: { email: string }) {
    const user = this.users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newStartDate = new Date();
    const newEndDate = new Date();
    newEndDate.setMonth(newEndDate.getMonth() + 1);

    user.subscriptionStartDate = newStartDate.toISOString();
    user.subscriptionEndDate = newEndDate.toISOString();

    console.log('User subscription upgraded:', user);

    return {
      message: 'Subscription upgraded',
      user,
    };
  }

  getAllUsers({ page, take, gender, email }) {
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

    let Genderfilter = paginatedUsers;

    console.log(gender, 'gender from service');
    if (gender) {
      Genderfilter = paginatedUsers.filter(
        (users) => users.gender?.toLowerCase() === gender.toLowerCase(),
      );
    }

    let finalFilter = Genderfilter;
    if (email) {
      const search = email.toLowerCase().trim();
      finalFilter = Genderfilter.filter((user) =>
        user.email?.toLowerCase().includes(search),
      );
    }

    if (finalFilter.length === 0) {
      throw new NotFoundException(
        '404 NOT FOUND, NO USERS FOUND WITH GIVEN FILTERS',
      );
    }

    return finalFilter;
  }

  getUserByEmail(email: string) {
    return this.users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  getUserById(id: number) {
    const user = this.users.find((el) => el.id === id);
    if (!user) throw new NotFoundException('User Not Found');
    return user;
  }

  createUser(createUserDto: CreateUserDto) {
    const { name, lastname, email, phoneNumber, gender } = createUserDto;
    const subscriptionStartDate = new Date().toISOString();
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

    const lastId = this.users[this.users.length - 1]?.id || 0;
    const newUser = {
      id: lastId + 1,
      name,
      lastname,
      email,
      phoneNumber,
      gender,
      subscriptionStartDate,
      subscriptionEndDate: subscriptionEndDate.toISOString(),
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
