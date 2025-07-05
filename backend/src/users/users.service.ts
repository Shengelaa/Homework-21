import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/user.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Expense } from 'src/expenses/schema/expense.schema';
import { Product } from 'src/products/schema/product.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('expense') private expenseModel: Model<Expense>,
    @InjectModel('user') private userModel: Model<User>,
    @InjectModel('product') private productModel: Model<Product>,
  ) {}

  async getUserByEmailAndUpgradeSubscription({ email }: { email: string }) {
    const normalizedEmail = email.toLowerCase();

    const user = await this.userModel
      .findOne({ email: normalizedEmail })
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newStartDate = new Date();
    const newEndDate = new Date();
    newEndDate.setMonth(newEndDate.getMonth() + 1);

    user.subscriptionStartDate = newStartDate.toISOString();
    user.subscriptionEndDate = newEndDate.toISOString();

    await user.save();

    return user;
  }

  async getAllUsers({ page = 1, take = 30, gender, email }) {
    const currentPage = page > 0 ? page : 1;
    const pageSize = take > 0 ? take : 10;

    const skip = (currentPage - 1) * pageSize;

    const query: Record<string, any> = {};

    if (gender) {
      query.gender = new RegExp(`^${gender}$`, 'i');
    }

    if (email) {
      query.email = new RegExp(email, 'i');
    }

    const users = await this.userModel
      .find(query)
      .skip(skip)
      .limit(pageSize)
      .exec();

    const totalUsers = await this.userModel.countDocuments(query);

    if (!users.length) {
      throw new NotFoundException(
        '404 NOT FOUND, NO USERS FOUND WITH GIVEN FILTERS',
      );
    }

    return users;
  }
  async updateUserRole(changeRoleDto) {
    const user = await this.userModel.findById(changeRoleDto.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.role = changeRoleDto.role;
    return await user.save();
  }

  async getUserByEmail(email: string) {
    const normalizedEmail = email.toLowerCase();
    return await this.userModel.findOne({ email: normalizedEmail });
  }

  async getUserById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('No Users fond with matching id');
    }

    return user;
  }
  async createUser(createUserDto: CreateUserDto) {
    const { name, lastname, email, phoneNumber, gender } = createUserDto;
    const subscriptionStartDate = new Date().toISOString();
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

    const role = 'user';

    const newUser = await this.userModel.create({
      name,
      lastname,
      email,
      phoneNumber,
      gender,
      role,
      subscriptionStartDate,
      subscriptionEndDate: subscriptionEndDate.toISOString(),
    });

    return { success: 'ok', data: newUser };
  }

  async deleteUserById(id: string, userId: string) {
    const deletedUser = await this.userModel.findOneAndDelete({ _id: id });
    console.log(userId, 'this is userId from token');
    console.log(id, 'this is id provided from params');
    if (id !== userId) {
      throw new ForbiddenException('This is not ur account');
    }

    if (!deletedUser) {
      throw new NotFoundException('User not found or already deleted');
    }

    const deletedExpenses = await this.expenseModel.deleteMany({ owner: id });
    const deletedProducts = await this.productModel.deleteMany({ owner: id });

    return {
      message:
        'User and all related expenses and products deleted successfully',
      data: {
        deletedUser,
        deletedExpenses,
        deletedProducts,
      },
    };
  }

  async updateUserById(
    id: string,
    updateUserDto: UpdateUserDto,
    userId: string,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    if (id !== userId) {
      throw new ForbiddenException('This is not ur account');
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { $set: updateUserDto },
      { new: true },
    );

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }
}
