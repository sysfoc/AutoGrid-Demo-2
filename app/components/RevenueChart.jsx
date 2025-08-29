"use client";
import React from "react";
import { Chart } from "react-google-charts";

const RevenueChart = () => {
  const data = [
    ["Week", "Sales", "Expenses"],
    ["Mon", 1000, 400],
    ["Tue", 1170, 460],
    ["Wed", 660, 1120],
    ["Thur", 1030, 540],
    ["Fri", 100, 200],
  ];
  const options = {
    title: "Weekly Revenue",
    hAxis: { title: "Week", titleTextStyle: { color: "#333" } },
    vAxis: { minValue: 0 },
    colors: ["#0DCAF0", "#15CA20"],
    areaOpacity: 0.8,
    legend: { position: "bottom" },
  };
  return (
    <div className="bg-white shadow">
      <div>
        <Chart
          chartType="AreaChart"
          data={data}
          options={options}
          width={300}
          height={380}
        />
      </div>
    </div>
  );
};

export default RevenueChart;
