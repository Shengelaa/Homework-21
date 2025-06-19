import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  private expenses = [
    { id: 1, category: 'shopping', quantity: 2, price: 400, totalPrice: 800 },
    { id: 2, category: 'shopping', quantity: 2, price: 400, totalPrice: 800 },
    { id: 3, category: 'food', quantity: 2, price: 400, totalPrice: 800 },
  ];

  getAllExpenses({ page, take, category }) {
    if (!page && !take) {
      page = 1;
      take = 30;
    }

    console.log(take);
    const currentPage = page > 0 ? page : 1;
    const pageSize = take > 0 ? take : 10;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedExpenses = this.expenses.slice(startIndex, endIndex);
    console.log(page, take, 'service');
    let result = paginatedExpenses;
    if (category) {
      result = paginatedExpenses.filter(
        (expense) => expense.category?.toLowerCase() === category.toLowerCase(),
      );
    }

    if (result.length === 0) {
      throw new NotFoundException(
        '404 NOT FOUND, NO EXPENSE FOUND WITH GIVEN FILTERS',
      );
    }

    return result;
  }

  getExpenseById(id: number) {
    const expense = this.expenses.find((el) => el.id === id);

    if (!expense)
      throw new NotFoundException('No expense found with matching id');

    return expense;
  }

  createExpense(CreateExpenseDto: CreateExpenseDto) {
    const { category, quantity, price } = CreateExpenseDto;
    if (!category || !quantity || !price) {
      throw new BadRequestException('Givee All Required fields');
    }
    const lastId = this.expenses[this.expenses.length - 1]?.id || 0;

    const newExpense = {
      id: lastId + 1,
      category,
      quantity,
      price,
      totalPrice: quantity * price,
    };

    this.expenses.push(newExpense);

    return 'created successfully';
  }

  deleteExpenseById(id: number) {
    const index = this.expenses.findIndex((el) => el.id === id);
    if (index === -1) {
      throw new NotFoundException('Expense not found with mattching it');
    }
    this.expenses.splice(index, 1);
    return 'Expense Deleted successfully';
  }

  updateExpenseById(id: number, updateExpenseDto: UpdateExpenseDto) {
    const index = this.expenses.findIndex((el) => el.id === id);

    if (index === -1) throw new NotFoundException('user not found');
    const updateReq: UpdateExpenseDto = {};
    const currentExpense = this.expenses[index];

    const updatedPrice = updateExpenseDto.price ?? currentExpense.price;
    const updatedQuantity =
      updateExpenseDto.quantity ?? currentExpense.quantity;

    if (updateExpenseDto.category) {
      updateReq.category = updateExpenseDto.category;
    }
    if (updateExpenseDto.quantity) {
      updateReq.quantity = updateExpenseDto.quantity;
    }
    if (updateExpenseDto.price) {
      updateReq.price = updateExpenseDto.price;
    }

    if (updateExpenseDto.price && updateExpenseDto.quantity) {
    }

    this.expenses[index] = {
      ...this.expenses[index],
      ...updateReq,
      totalPrice: updatedPrice * updatedQuantity,
    };

    return 'update successfully';
  }
}
