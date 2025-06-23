import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { UserModule } from 'src/users/users.module';

@Module({
  imports: [UserModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
