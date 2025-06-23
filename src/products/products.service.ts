import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private products = [
    {
      id: 1,
      price: 4000,
      name: 'laptop',
      category: 'shopping',
      description: 'nice laptop',
    },
    {
      id: 2,
      price: 2000,
      name: 'shoes',
      category: 'shopping',
      description: 'nice shoes',
    },
    {
      id: 3,
      price: 5000,
      name: 'apple',
      category: 'food',
      description: 'nice food',
    },
  ];
  create(createProductDto: CreateProductDto) {
    const { price, name, category, description } = createProductDto;
    if (!price || !name || !category || !description) {
      throw new BadRequestException('Givee All Required fields');
    }
    const lastId = this.products[this.products.length - 1]?.id || 0;

    const newProduct = {
      id: lastId + 1,
      price,
      name,
      category,
      description,
    };

    this.products.push(newProduct);

    return 'created successfully';
  }

  findAll(hasSale: boolean = false) {
    const discount = 0.3;

    if (hasSale) {
      return this.products.map((product) => ({
        ...product,
        price: product.price * (1 - discount),
      }));
    }

    return this.products;
  }

  findOne(id: number) {
    const product = this.products.find((el) => el.id === id);

    if (!product)
      throw new NotFoundException('No expense found with matching id');

    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    const index = this.products.findIndex((el) => el.id === id);
    if (index === -1) throw new NotFoundException('user not found');

    const updateReq: Partial<UpdateProductDto> = {};
    if (updateProductDto.price) {
      updateReq.price = updateProductDto.price;
    }
    if (updateProductDto.name) {
      updateReq.name = updateProductDto.name;
    }
    if (updateProductDto.category) {
      updateReq.category = updateProductDto.category;
    }

    if (updateProductDto.description) {
      updateReq.description = updateProductDto.description;
    }

    this.products[index] = {
      ...this.products[index],
      ...updateReq,
    };

    return 'updated successfully';
  }

  remove(id: number) {
    const index = this.products.findIndex((el) => el.id === id);
    if (index === -1) {
      throw new NotFoundException('products not found with mattching it');
    }
    this.products.splice(index, 1);
    return 'product Deleted successfully';
  }
}
