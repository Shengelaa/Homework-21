"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axios-instance";
import { deleteCookie, getCookie } from "cookies-next";

type ExpenseType = {
  category: string;
  price: number;
  quantity: number;
};

type User = {
  _id: string;
  name: string;
  lastname: string;
  email: string;
  gender: string;
};

export default function Page() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<ExpenseType>();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      router.push("/auth/sign-in");
      return;
    }

    const getCurrentUser = async () => {
      try {
        const resp = await axiosInstance.get("/auth/current-user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resp.status === 200) {
          setUser(resp.data);
          console.log("User ID:", resp.data._id);
        }
      } catch (e) {
        deleteCookie("token");
        router.push("/auth/sign-in");
      }
    };

    getCurrentUser();
  }, [router]);



  const onSubmit = async (data: ExpenseType) => {
    try {
      const token = getCookie("token");
      if (!token) {
        toast.error("Authentication token missing. Please login again.");
        router.push("/auth/sign-in");
        return;
      }
      if (!user?._id) {
        toast.error("User not found. Please login again.");
        router.push("/auth/sign-in");
        return;
      }

      const resp = await axiosInstance.post("/expenses", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "user-id": user._id,
        },
      });

      if (resp.status === 201) {
        toast.success("Expense created successfully");
        router.push("/");
        return;
      }
      toast.error(resp.data.message);
    } catch (e: any) {
      if (typeof e.response?.data?.message === "string") {
        toast.error(e.response.data.message);
      } else if (Array.isArray(e.response?.data?.message)) {
        toast.error(e.response.data.message.join(", "));
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create a new expense</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  {...register("category", { required: true })}
                  placeholder="Food, Sport, Shopping"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  {...register("price", {
                    valueAsNumber: true,
                    required: true,
                  })}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  {...register("quantity", {
                    valueAsNumber: true,
                    required: true,
                  })}
                  placeholder="1"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full mt-4">
              Create Expense
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
