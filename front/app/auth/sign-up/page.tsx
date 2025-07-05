"use client";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpSchema, SignupType } from "@/validation/sign-up.schema";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios-instance";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });
  const role = "user";
  const onSubmit = async ({
    name,
    lastname,
    phoneNumber,
    gender,
    email,
    password,
    role,
  }: SignupType) => {
    try {
      const resp = await axiosInstance.post("/auth/sign-up", {
        name,
        lastname,
        email,
        phoneNumber,
        gender,
        password,
        role: "user",
      });

      if (resp.status === 201) {
        toast.success("registered successfully");
        router.push("/auth/sign-in");
        return;
      }
      toast.error(resp.data.message);
    } catch (e: any) {
      if (typeof e.response.data.message === "string") {
        toast.error(e.response.data.message);
      }
      if (
        typeof e.response.data.message === "object" &&
        Array.isArray(e.response.data.message)
      ) {
        toast.error(e.response.data.message.map((e: string) => e));
      }
    }
  };
  useEffect(() => {
    if (Object.keys(errors)) {
      toast.error("Fill Requried FIelds");
    }
  }, [errors]);

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create a new account</CardTitle>

          <CardAction>
            <Button variant="link">Sign In</Button>
          </CardAction>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">name</Label>
                <Input
                  {...register("name")}
                  id="name"
                  type="name"
                  placeholder="John"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastname">lastname</Label>
                <Input
                  {...register("lastname")}
                  id="lastname"
                  type="lastname"
                  placeholder="Doe"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <Input
                  {...register("gender")}
                  id="gender"
                  type="gender"
                  placeholder="Male / Female / Other"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">phone Number</Label>
                <Input
                  {...register("phoneNumber")}
                  id="phoneNumber"
                  type="number"
                  placeholder="555123123"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  {...register("password")}
                  id="password"
                  type="password"
                  required
                  placeholder="*****"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full mt-4">
              Sign Up
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
