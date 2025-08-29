"use client";
import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";

const BarChart = () => {
  const [chartData, setChartData] = useState([
    ["Month", "New Listings", "Total Inventory"],
    ["Loading...", 0, 0]
  ]);
  const [loading, setLoading] = useState(true);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await fetch('/api/cars');
        const data = await response.json();
        
        if (data.cars && data.cars.length > 0) {
          // Process cars by month based on createdAt
          const monthlyData = {};
          const currentYear = new Date().getFullYear();
          
          // Initialize all months
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          
          months.forEach(month => {
            monthlyData[month] = { newListings: 0, totalInventory: 0 };
          });
          
          // Calculate cumulative inventory and monthly additions
          let cumulativeInventory = 0;
          
          data.cars.forEach(car => {
            const carDate = new Date(car.createdAt);
            if (carDate.getFullYear() === currentYear) {
              const monthIndex = carDate.getMonth();
              const monthName = months[monthIndex];
              monthlyData[monthName].newListings += 1;
            }
          });
          
          // Calculate cumulative inventory for each month
          months.forEach(month => {
            cumulativeInventory += monthlyData[month].newListings;
            monthlyData[month].totalInventory = cumulativeInventory;
          });
          
          // Convert to chart format
          const chartDataArray = months.map(month => [
            month,
            monthlyData[month].newListings,
            monthlyData[month].totalInventory
          ]);
          
          setChartData([
            ["Month", "New Listings", "Total Inventory"],
            ...chartDataArray
          ]);
          
          // Calculate total inventory value
          const totalInventoryValue = data.cars.reduce((sum, car) => {
            return sum + (car.price || 0);
          }, 0);
          
          setTotalValue(totalInventoryValue);
        } else {
          setChartData([
            ["Month", "New Listings", "Total Inventory"],
            ["No Data", 0, 0]
          ]);
        }
      } catch (error) {
        console.error("Error fetching car data:", error);
        setChartData([
          ["Month", "New Listings", "Total Inventory"],
          ["Error", 0, 0]
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, []);

  const options = {
    chart: {
      title: "Vehicle Inventory Analytics",
      subtitle: "Monthly new listings and cumulative inventory growth",
    },
    bars: 'vertical',
    vAxis: {
      title: "Number of Vehicles",
      minValue: 0,
      gridlines: { 
        count: 8,
        color: '#f0f0f0'
      },
      textStyle: {
        fontSize: 11,
        fontName: 'Inter'
      }
    },
    hAxis: { 
      title: "Months",
      textStyle: {
        fontSize: 11,
        fontName: 'Inter'
      }
    },
    colors: ["#3b82f6", "#10b981"],
    legend: {
      position: "top",
      alignment: "center",
      textStyle: {
        fontSize: 12,
        fontName: 'Inter'
      }
    },
    chartArea: {
      left: 60,
      top: 80,
      width: '85%',
      height: '70%'
    },
    backgroundColor: 'transparent',
    titleTextStyle: {
      fontSize: 14,
      fontName: 'Inter',
      bold: true
    },
    animation: {
      duration: 1000,
      easing: 'out',
      startup: true
    },
    bar: { groupWidth: "75%" },
    isStacked: false
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Inventory Growth Analytics</h3>
          <div className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
            Monthly Overview
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Track new listings and cumulative inventory growth</p>
      </div>
      
      {loading ? (
        <div className="h-72 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="p-2">
          <Chart
            chartType='Bar'
            data={chartData}
            options={options}
            width="100%"
            height="300px"
          />
        </div>
      )}
      
      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
        <div className="flex justify-between items-center">
          <span>Total Inventory Value</span>
          <span className="font-medium text-green-600">{formatCurrency(totalValue)}</span>
        </div>
      </div>
    </div>
  );
};

export default BarChart;