"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const SalesChart = () => {
  const salesData = [
    { name: "Jan", sales: 3500, profit: 2400 },
    { name: "Feb", sales: 3000, profit: 2210 },
    { name: "Mar", sales: 2000, profit: 2290 },
    { name: "Apr", sales: 2780, profit: 2000 },
    { name: "May", sales: 1890, profit: 2181 },
    { name: "Jun", sales: 2390, profit: 2500 },
    { name: "Jul", sales: 1490, profit: 2100 },
  ];
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold">Sales Overview</h2>
      <div className="mt-3 h-[400px] w-[800px] md:w-full">
        <ResponsiveContainer>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#8884d8"
              fill="#8884d8"
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#82ca9d"
              fill="#82ca9d"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default SalesChart;
