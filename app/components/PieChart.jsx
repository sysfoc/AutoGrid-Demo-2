"use client";
import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";

export const PieChart = () => {
  const [chartData, setChartData] = useState([
    ["Make", "Count"],
    ["Loading...", 1],
  ]);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await fetch('/api/cars');
        const data = await response.json();
        
        if (data.cars && data.cars.length > 0) {
          const makeCounts = data.cars.reduce((acc, car) => {
            acc[car.make] = (acc[car.make] || 0) + 1;
            return acc;
          }, {});
          
          const chartDataArray = Object.entries(makeCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([make, count]) => [make, count]);
          
          setChartData([
            ["Make", "Count"],
            ...chartDataArray
          ]);
          
          setTotalVehicles(data.cars.length);
        } else {
          setChartData([
            ["Make", "Count"],
            ["No Data", 1]
          ]);
        }
      } catch (error) {
        console.error("Error fetching car data:", error);
        setChartData([
          ["Make", "Count"],
          ["Error", 1]
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, []);

  const options = {
    title: "",
    pieHole: 0.4,
    legend: {
      position: "labeled",
      alignment: "center",
      textStyle: {
        color: "#6b7280",
        fontSize: 12,
        fontName: "Inter"
      },
    },
    chartArea: {
      width: "90%",
      height: "80%",
      left: "5%",
      top: "10%"
    },
    colors: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4", "#f97316"],
    pieSliceText: "label",
    pieSliceTextStyle: {
      color: "white",
      fontSize: 11,
      bold: true
    },
    tooltip: { 
      text: "percentage", 
      textStyle: { 
        fontName: "Inter", 
        fontSize: 12 
      },
      showColorCode: true
    },
    enableInteractivity: true,
    fontSize: 12,
    fontName: "Inter",
    animation: {
      duration: 1000,
      easing: "out",
      startup: true
    },
    pieStartAngle: 0,
    slices: {
      0: { offset: 0.05 },
      1: { offset: 0.03 }
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Inventory Distribution by Make</h3>
          <div className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
            Current Inventory
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Percentage distribution of vehicle makes</p>
      </div>
      
      {loading ? (
        <div className="h-72 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="p-2">
          <Chart
            chartType="PieChart"
            data={chartData}
            options={options}
            width={"100%"}
            height={"300px"}
          />
        </div>
      )}
      
      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>Total Vehicles</span>
          <span className="font-medium">{totalVehicles} vehicles</span>
        </div>
      </div>
    </div>
  );
};

export default PieChart;