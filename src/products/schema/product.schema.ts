import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Product {
  @Prop({
    type: Number,
    required: true,
  })
  price: number;
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
  })
  category: string;
  @Prop({
    type: String,
    required: true,
  })
  description: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  })
  owner: mongoose.Schema.Types.ObjectId;
}

export const productSchema = SchemaFactory.createForClass(Product);
