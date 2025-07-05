"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios-instance";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  type User = {
    _id: string;
    name: string;
    lastname: string;
    email: string;
    gender: string;
    role: string;
  };

  type Expense = {
    _id: string;
    category: string;
    price: number;
    quantity: number;
    totalPrice: number;
  };

  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [tokenChecked, setTokenChecked] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = getCookie("token");
    if (!t || typeof t !== "string") {
      router.push("/auth/sign-in");
      return;
    }
    setToken(t);
    setTokenChecked(true);
  }, []);

  useEffect(() => {
    if (!token) return;

    const getCurrentUser = async () => {
      try {
        const resp = await axiosInstance.get("/auth/current-user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resp.status === 200) setUser(resp.data);
      } catch (e) {
        deleteCookie("token");
        router.push("/auth/sign-in");
      }
    };

    const getAllExpenses = async () => {
      try {
        const resp = await axiosInstance.get("/expenses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resp.status === 200 && Array.isArray(resp.data)) {
          setExpenses(resp.data);
        } else {
          setExpenses([]);
        }
      } catch (e) {
        setExpenses([]);
      }
    };

    getCurrentUser();
    getAllExpenses();
  }, [token]);

  if (!tokenChecked) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end">
        <Card className="w-full max-w-xs p-4 bg-white border border-gray-200 rounded-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">
              About Me
            </CardTitle>
          </CardHeader>
          <div className="space-y-1 text-sm text-gray-700 px-4">
            <p>
              <span className="font-medium">ID:</span> {user?._id}
            </p>
            <p>
              <span className="font-medium">Role:</span> {user?.role}
            </p>
            <p>
              <span className="font-medium">First Name:</span> {user?.name}
            </p>

            <p>
              <span className="font-medium">Last Name:</span> {user?.lastname}
            </p>
          </div>

          {user?.role === "admin" && (
            <Button
              className="cursor-pointer mt-4"
              onClick={() => router.push("/analytics")}
            >
              View Analytics
            </Button>
          )}
          {user?.role === "admin" && (
            <Button
              className="cursor-pointer mt-[-13px]"
              onClick={() => router.push("/change-role")}
            >
              Change Roles
            </Button>
          )}
          <Button
            className="cursor-pointer mt-[-13px]"
            onClick={() => router.push("/create-expense")}
          >
            Create Expense
          </Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {expenses.map((expense) => (
          <Card key={expense._id} className="bg-white shadow-sm border">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-gray-800">
                {expense.category}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                ID: {expense._id}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-medium">Price:</span> ${expense.price}
              </p>
              <p>
                <span className="font-medium">Quantity:</span>{" "}
                {expense.quantity}
              </p>
              <p>
                <span className="font-medium">Total:</span> $
                {expense.totalPrice}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
