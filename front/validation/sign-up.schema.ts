import { InferType, number, object, string } from "yup";

export const signUpSchema = object({
  name: string().required(),
  lastname: string().required(),
  email: string().email().required(),
  password: string().min(8).max(20).required(),
  gender: string().required(),
  phoneNumber: number().required(),
  role: string()
});

export type SignupType = InferType<typeof signUpSchema>;
