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

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  createExpense(
    @Headers('user-id') userId: string,
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
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
