import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Controller('expenses')
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Get()
  getAllExpenses() {
    return this.expensesService.getAllExpenses();
  }

  @Get(':id')
  getExpenseById(@Param('id') id) {
    return this.expensesService.getExpenseById(Number(id));
  }

  @Post()
  createExpense(@Body() CreateExpenseDto: CreateExpenseDto) {
    const category = CreateExpenseDto.category;
    const quantity = CreateExpenseDto.quantity;
    const price = CreateExpenseDto.price;
    return this.expensesService.createExpense({ category, quantity, price });
  }

  @Delete(':id')
  deleteUser(@Param('id') id) {
    return this.expensesService.deleteExpenseById(Number(id));
  }

  @Put(':id')
  updateUser(@Param('id') id, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expensesService.updateExpenseById(Number(id), updateExpenseDto)
  }
}
