import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { QueryParamsDto } from './dto/pagination-expense.dto';
import { CategoryPipe } from './pipes/category.pipe';
import { HasUserId } from 'src/guards/has-user-id.guard';
import { IsAuthGuard } from 'src/auth/guards/isAuth.guard';
import { UserId } from 'src/users/decorators/user.decorator';
@UseGuards(IsAuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Get()
  getAllExpenses(@Query() query: QueryParamsDto) {
    const { page, take, category } = query;
    const categoryFilter = new CategoryPipe();
    const CategoryFilterSender = categoryFilter.transform(category, {
      type: 'body',
    });

    console.log(page, take, 'page and query');
    return this.expensesService.getAllExpenses({ page, take, category });
  }

  @Get(':id')
  getExpenseById(@Param('id') id) {
    return this.expensesService.getExpenseById(String(id));
  }

  @Post()
  @UseGuards(HasUserId)
  createExpense(
    @UserId() userId: string,
    @Body() CreateExpenseDto: CreateExpenseDto,
  ) {
    const category = CreateExpenseDto.category;
    const quantity = CreateExpenseDto.quantity;
    const price = CreateExpenseDto.price;

    return this.expensesService.createExpense(CreateExpenseDto, userId);
  }

  @Delete(':id')
  deleteUser(@Param('id') id, @UserId() userId: string) {
    return this.expensesService.deleteExpenseById(String(id), String(userId));
  }

  @Put(':id')
  updateUser(
    @Param('id') id,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @UserId() userId: string,
  ) {
    return this.expensesService.updateExpenseById(
      String(id),
      updateExpenseDto,
      String(userId),
    );
  }
}
