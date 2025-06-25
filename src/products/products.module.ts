import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { UserModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/users/schema/user.schema';
import { productSchema } from './schema/product.schema';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { schema: userSchema, name: 'user' },
      { schema: productSchema, name: 'product' },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
