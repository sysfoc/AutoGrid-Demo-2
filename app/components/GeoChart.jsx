"use client";
import React from "react";
import { Chart } from "react-google-charts";
const GeoChart = () => {
  const data = [
    ["Country", "Popularity"],
    ["Germany", 200],
    ["United States", 300],
    ["Brazil", 400],
    ["Canada", 500],
    ["France", 600],
    ["RU", 700],
  ];
  const option = {
    region: "world",
    title: "Popularity by Country",
  };
  return (
    <div className="bg-white p-4 shadow">
      <Chart
        chartEvents={[
          {
            eventName: "select",
            callback: ({ chartWrapper }) => {
              const chart = chartWrapper.getChart();
              const selection = chart.getSelection();
              if (selection.length === 0) return;
              const region = data[selection[0].row + 1];
            },
          },
        ]}
        chartType="GeoChart"
        width={630}
        height={350}
        data={data}
        options={option}
      />
    </div>
  );
};

export default GeoChart;
