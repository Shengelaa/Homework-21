import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './schema/expense.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/users/schema/user.schema';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel('expense') private expenseModel: Model<Expense>,
    @InjectModel('user') private userModel: Model<User>,
  ) {}

  async getAllExpenses({
    page,
    take,
    category,
  }: {
    page?: number;
    take?: number;
    category?: string;
  }) {
    const currentPage = page && page > 0 ? page : 1;
    const pageSize = take && take > 0 ? take : 30;

    const expenses = await this.expenseModel
      .find()
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    let filteredExpenses = expenses;
    if (category) {
      const catLower = category.toLowerCase();
      filteredExpenses = expenses.filter(
        (expense) => expense.category?.toLowerCase() === catLower,
      );
    }

    if (filteredExpenses.length === 0) {
      throw new NotFoundException(
        '404 NOT FOUND, NO EXPENSE FOUND WITH GIVEN FILTERS',
      );
    }

    return filteredExpenses;
  }

  async getExpenseById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid expense ID');
    }
    const expense = await this.expenseModel.findById(id);
    if (!expense) {
      throw new NotFoundException('No expense found with matching ID');
    }
    return expense;
  }

  async createExpense(CreateExpenseDto: CreateExpenseDto, userId: string) {
    const existUser = await this.userModel.findById(userId);
    if (!existUser) throw new BadRequestException('User not found');

    const { category, quantity, price } = CreateExpenseDto;
    if (!category || !quantity || !price) {
      throw new BadRequestException('Givee All Required fields');
    }
    const totalPrice = quantity * price;
    const newExpense = await this.expenseModel.create({
      category,
      quantity,
      price,
      totalPrice,
      owner: existUser._id,
    });

    existUser.expenses.push(newExpense._id);
    await existUser.save();
    return newExpense;
  }

  async deleteExpenseById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid expense ID');
    }

    const deletedExpense = await this.expenseModel
      .findOneAndDelete({ _id: id })
      .exec();

    if (!deletedExpense) {
      throw new NotFoundException('Expense not found or already deleted');
    }

    await this.userModel.updateOne(
      { _id: deletedExpense.owner },
      { $pull: { expenses: deletedExpense._id } },
    );

    return { message: 'Expense deleted successfully' };
  }

  async updateExpenseById(id: string, updateExpenseDto: UpdateExpenseDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid expense ID');
    }

    const existingExpense = await this.expenseModel.findById(id);

    if (!existingExpense) {
      throw new NotFoundException('Expense not found');
    }

    if (updateExpenseDto.category) {
      existingExpense.category = updateExpenseDto.category;
    }

    if (updateExpenseDto.quantity !== undefined) {
      existingExpense.quantity = updateExpenseDto.quantity;
    }

    if (updateExpenseDto.price !== undefined) {
      existingExpense.price = updateExpenseDto.price;
    }

    existingExpense.totalPrice =
      existingExpense.price * existingExpense.quantity;

    await existingExpense.save();

    return {
      message: 'Expense updated successfully',
      expense: existingExpense,
    };
  }
}
