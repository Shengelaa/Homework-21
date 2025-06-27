import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Headers,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SafeGuard } from 'src/guards/safe.guard';
import { IsAuthGuard } from 'src/auth/guards/isAuth.guard';
import { UserId } from 'src/users/decorators/user.decorator';
@UseGuards(IsAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  createExpense(
    @UserId() userId: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    const price = createProductDto.price;
    const name = createProductDto.name;
    const category = createProductDto.category;
    const description = createProductDto.description;
    return this.productsService.create(
      {
        price,
        name,
        category,
        description,
      },
      userId,
    );
  }

  @Get()
  @UseGuards(SafeGuard)
  findAll(@Req() req: Request) {
    const hasSale = req['hasSale'] || false;
    return this.productsService.findAll(hasSale);
  }

  @Get(':id')
  findOne(@Param('id') id) {
    return this.productsService.findOne(String(id));
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UserId() userId: string,
  ) {
    return this.productsService.update(id, updateProductDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @UserId() userId: string) {
    return this.productsService.remove(id, userId);
  }
}
