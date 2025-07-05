import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './schema/user.schema';
import { expenseSchema } from 'src/expenses/schema/expense.schema';
import { productSchema } from 'src/products/schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { schema: expenseSchema, name: 'expense' },
      { schema: userSchema, name: 'user' },
        { schema: productSchema, name: 'product' },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
