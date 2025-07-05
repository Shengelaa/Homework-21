import { InferType, number, object, string } from "yup";

export const expenseSchema = object({
  category: string().required(),
  quantity: number().required(),
  price: number().required(),
});

export type ExpenseType = InferType<typeof expenseSchema>;
