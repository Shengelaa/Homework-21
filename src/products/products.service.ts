import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from './schema/product.schema';
import { User } from 'src/users/schema/user.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('product') private productModel: Model<Product>,
    @InjectModel('user') private userModel: Model<User>,
  ) {}
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
  async create(createProductDto: CreateProductDto, userId: string) {
    const existUser = await this.userModel.findById(userId);
    if (!existUser) throw new BadRequestException('User not found');

    const { price, name, category, description } = createProductDto;

    if (!price || !name || !category || !description) {
      throw new BadRequestException(
        'Please provide category, quantity, and price',
      );
    }

    const newProduct = await this.productModel.create({
      category,

      price,

      name,
      description,
      owner: existUser._id,
    });

    existUser.products.push(newProduct._id);
    await existUser.save();

    return newProduct;
  }
  async findAll(hasSale: boolean = false): Promise<Product[]> {
    const discount = 0.3;

    const products = await this.productModel.find().lean();

    if (hasSale) {
      return products.map((product) => ({
        ...product,
        price: product.price * (1 - discount),
      }));
    }

    return products;
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id);

    if (!product)
      throw new NotFoundException('No product found with matching id');

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID');
    }

    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      { $set: updateProductDto },
      { new: true },
    );

    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }

    return {
      message: 'Updated successfully',
      product: updatedProduct,
    };
  }

  async remove(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestException('Invalid product ID');
  }

 
  const product = await this.productModel.findByIdAndDelete(id);

  if (!product) {
    throw new NotFoundException(
      'Gavrolot errori , davartyat errori ar moizebna producti :D',
    );
  }


  await this.userModel.updateOne(
    { _id: product.owner },           
    { $pull: { products: product._id } }
  );

  return {
    message: 'weishala',
    data: {
      product,
    },
  };
}

}
