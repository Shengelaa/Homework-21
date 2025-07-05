"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios-instance";
import { getCookie, deleteCookie } from "cookies-next";
import { useEffect, useState } from "react";

type ChangeRoleForm = {
  userIdOrEmail: string;
  newRole: "admin" | "user";
};

export default function ChangeRolePage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ChangeRoleForm>();

  useEffect(() => {
    const t = getCookie("token");
    if (!t || typeof t !== "string") return router.push("/auth/sign-in");
    setToken(t);

    axiosInstance
      .get("/auth/current-user", {
        headers: { Authorization: `Bearer ${t}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (res.data.role !== "admin") router.push("/");
          else setCurrentUserRole("admin");
        }
      })
      .catch(() => {
        deleteCookie("token");
        router.push("/auth/sign-in");
      });
  }, [router]);

  const onSubmit = async (data: ChangeRoleForm) => {
    if (!token) return;

    try {
      const res = await axiosInstance.put(
        `/users/change-role`,
        {
          id: data.userIdOrEmail,
          role: data.newRole,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200) {
        toast.success("User role updated successfully");
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to update role");
    }
  };

  if (!token || currentUserRole !== "admin") return null;

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Change User Role</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="userIdOrEmail">User ID</Label>
              <Input
                id="userIdOrEmail"
                type="string"
                {...register("userIdOrEmail", { required: true })}
                placeholder="Enter user ID or email"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="newRole">New Role</Label>
              <Select
                onValueChange={(val: any) =>
                  setValue("newRole", val as "admin" | "user")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full">
              Change Role
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
