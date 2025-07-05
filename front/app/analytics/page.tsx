"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCookie, deleteCookie } from "cookies-next";
import { axiosInstance } from "@/lib/axios-instance";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardTitle } from "@/components/ui/card";

type Expense = {
  category: string;
  price: number;
  quantity: number;
  totalPrice: number;
};

type User = {
  _id: string;
  role: string;
};

export default function AnalyticsPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = getCookie("token");
    if (!t || typeof t !== "string") return router.push("/");
    setToken(t);

    axiosInstance
      .get("/auth/current-user", { headers: { Authorization: `Bearer ${t}` } })
      .then((r) => {
        if (r.status !== 200 || r.data.role !== "admin") throw new Error();
        setRole(r.data.role);
      })
      .catch(() => {
        deleteCookie("token");
        router.push("/");
      });
  }, [router]);

  useEffect(() => {
    if (role !== "admin" || !token) return;

    Promise.all([
      axiosInstance.get("/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axiosInstance.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([exp, user]) => {
        if (Array.isArray(exp.data)) setExpenses(exp.data);
        if (Array.isArray(user.data)) setUsers(user.data);
      })
      .finally(() => setLoading(false));
  }, [role, token]);

  if (loading) return <div>Loading analytics…</div>;
  if (role !== "admin") return <div>Access denied</div>;

  const totalsByCategory = expenses.reduce<Record<string, number>>(
    (acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.totalPrice;
      return acc;
    },
    {}
  );
  const expenseData = Object.entries(totalsByCategory).map(
    ([category, total]) => ({
      category,
      total,
    })
  );

  const roleCounts = users.reduce<Record<string, number>>((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});
  const userRoleData = Object.entries(roleCounts).map(([role, count]) => ({
    name: role,
    value: count,
  }));

  const COLORS = ["#3182ce", "#82ca9d", "#f6ad55", "#e53e3e"];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      <h1 className="text-2xl font-bold">By Indian Guy & Levani </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-4">
          <CardTitle>Total Spend by Category</CardTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expenseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#3182ce" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <CardTitle>Spending Trends</CardTitle>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={expenses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" hide />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalPrice"
                stroke="#2b6cb0"
                name="Total Price"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4 col-span-1 lg:col-span-2">
          <CardTitle>User Roles Distribution</CardTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userRoleData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {userRoleData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
