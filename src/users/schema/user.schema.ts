import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
  })
  lastname: string;
  @Prop({
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  })
  email: string;
  @Prop({
    type: Number,
    required: true,
  })
  phoneNumber: number;
  @Prop({
    type: String,
    required: true,
  })
  gender: String;
  @Prop({
    type: String,
    required: true,
  })
  subscriptionStartDate: String;
  @Prop({
    type: String,
    required: true,
  })
  subscriptionEndDate: String;
  @Prop({
    type: [mongoose.Types.ObjectId],
    ref: 'expense',
    default: [],
  })
  expenses: mongoose.Types.ObjectId[];
  @Prop({
    type: [mongoose.Types.ObjectId],
    ref: 'product',
    default: [],
  })
  products: mongoose.Types.ObjectId[];
}

export const userSchema = SchemaFactory.createForClass(User);
