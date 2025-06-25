import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Expense {
  @Prop({
    type: String,
    required: true,
  })
  category: string;
  @Prop({
    type: Number,
    required: true,
  })
  quantity: number;

  @Prop({
    type: Number,
    required: true,
  })
  price: number;
  @Prop({
    type: Number,
    required: true,
  })
  totalPrice: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  })
  owner: mongoose.Schema.Types.ObjectId;
}

export const expenseSchema = SchemaFactory.createForClass(Expense);
