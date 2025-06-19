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
    // 50 more:
    { id: 4, category: 'sport', quantity: 1, price: 120, totalPrice: 120 },
    { id: 5, category: 'food', quantity: 3, price: 150, totalPrice: 450 },
    { id: 6, category: 'shopping', quantity: 5, price: 80, totalPrice: 400 },
    { id: 7, category: 'sport', quantity: 2, price: 200, totalPrice: 400 },
    { id: 8, category: 'food', quantity: 4, price: 90, totalPrice: 360 },
    { id: 9, category: 'shopping', quantity: 2, price: 300, totalPrice: 600 },
    { id: 10, category: 'food', quantity: 1, price: 200, totalPrice: 200 },
    { id: 11, category: 'sport', quantity: 3, price: 100, totalPrice: 300 },
    { id: 12, category: 'shopping', quantity: 6, price: 50, totalPrice: 300 },
    { id: 13, category: 'food', quantity: 2, price: 120, totalPrice: 240 },
    { id: 14, category: 'sport', quantity: 4, price: 90, totalPrice: 360 },
    { id: 15, category: 'shopping', quantity: 1, price: 500, totalPrice: 500 },
    { id: 16, category: 'food', quantity: 3, price: 140, totalPrice: 420 },
    { id: 17, category: 'sport', quantity: 2, price: 220, totalPrice: 440 },
    { id: 18, category: 'shopping', quantity: 2, price: 300, totalPrice: 600 },
    { id: 19, category: 'food', quantity: 2, price: 180, totalPrice: 360 },
    { id: 20, category: 'sport', quantity: 3, price: 150, totalPrice: 450 },
    {
      id: 21,
      category: 'shopping',
      quantity: 1,
      price: 1000,
      totalPrice: 1000,
    },
    { id: 22, category: 'food', quantity: 4, price: 110, totalPrice: 440 },
    { id: 23, category: 'sport', quantity: 2, price: 130, totalPrice: 260 },
    { id: 24, category: 'shopping', quantity: 3, price: 200, totalPrice: 600 },
    { id: 25, category: 'food', quantity: 1, price: 300, totalPrice: 300 },
    { id: 26, category: 'sport', quantity: 5, price: 90, totalPrice: 450 },
    { id: 27, category: 'shopping', quantity: 4, price: 150, totalPrice: 600 },
    { id: 28, category: 'food', quantity: 2, price: 250, totalPrice: 500 },
    { id: 29, category: 'sport', quantity: 3, price: 200, totalPrice: 600 },
    { id: 30, category: 'shopping', quantity: 2, price: 400, totalPrice: 800 },
    { id: 31, category: 'food', quantity: 5, price: 60, totalPrice: 300 },
    { id: 32, category: 'sport', quantity: 2, price: 140, totalPrice: 280 },
    { id: 33, category: 'shopping', quantity: 3, price: 180, totalPrice: 540 },
    { id: 34, category: 'food', quantity: 4, price: 80, totalPrice: 320 },
    { id: 35, category: 'sport', quantity: 1, price: 250, totalPrice: 250 },
    { id: 36, category: 'shopping', quantity: 2, price: 300, totalPrice: 600 },
    { id: 37, category: 'food', quantity: 3, price: 90, totalPrice: 270 },
    { id: 38, category: 'sport', quantity: 4, price: 110, totalPrice: 440 },
    { id: 39, category: 'shopping', quantity: 5, price: 100, totalPrice: 500 },
    { id: 40, category: 'food', quantity: 1, price: 500, totalPrice: 500 },
    { id: 41, category: 'sport', quantity: 3, price: 170, totalPrice: 510 },
    { id: 42, category: 'shopping', quantity: 2, price: 450, totalPrice: 900 },
    { id: 43, category: 'food', quantity: 2, price: 220, totalPrice: 440 },
    { id: 44, category: 'sport', quantity: 2, price: 300, totalPrice: 600 },
    { id: 45, category: 'shopping', quantity: 1, price: 700, totalPrice: 700 },
    { id: 46, category: 'food', quantity: 2, price: 210, totalPrice: 420 },
    { id: 47, category: 'sport', quantity: 4, price: 95, totalPrice: 380 },
    { id: 48, category: 'shopping', quantity: 3, price: 320, totalPrice: 960 },
    { id: 49, category: 'food', quantity: 2, price: 180, totalPrice: 360 },
    { id: 50, category: 'sport', quantity: 1, price: 400, totalPrice: 400 },
    { id: 51, category: 'shopping', quantity: 2, price: 330, totalPrice: 660 },
    { id: 52, category: 'food', quantity: 3, price: 100, totalPrice: 300 },
    { id: 53, category: 'sport', quantity: 5, price: 85, totalPrice: 425 },
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
