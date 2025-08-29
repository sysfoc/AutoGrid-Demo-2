"use client";

import React, { useState } from "react";
import { ChevronUp, ChevronDown, Search, CircleUser } from "lucide-react";
import  { AiFillProduct } from "react-icons/ai";
import Link from "next/link";

const OrdersTable = () => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");

  const tableData = [
    {
      id: "ORD001",
      name: "John Doe",
      email: "john.doe@gmail.com",
      phone: "123-456-7890",
      status: "Active",
      orderDate: "2025-06-01",
      total: 149.99,
    },
    {
      id: "ORD002",
      name: "Jane Smith",
      email: "jane.smith@gmail.com",
      phone: "987-654-3210",
      status: "Inactive",
      orderDate: "2025-05-28",
      total: 89.5,
    },
    {
      id: "ORD003",
      name: "Michael Brown",
      email: "michael.brown@gmail.com",
      phone: "456-789-1234",
      status: "Active",
      orderDate: "2025-06-10",
      total: 249.99,
    },
    {
      id: "ORD004",
      name: "Emily Johnson",
      email: "emily.johnson@gmail.com",
      phone: "321-654-9870",
      status: "Active",
      orderDate: "2025-06-05",
      total: 199.0,
    },
    {
      id: "ORD005",
      name: "Chris Wilson",
      email: "chris.wilson@gmail.com",
      phone: "654-321-7890",
      status: "Active",
      orderDate: "2025-06-03",
      total: 99.95,
    },
    {
      id: "ORD006",
      name: "Sarah Davis",
      email: "sarah.davis@gmail.com",
      phone: "789-123-4560",
      status: "Inactive",
      orderDate: "2025-05-30",
      total: 179.49,
    },
  ];

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedData = [...tableData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredData = sortedData.filter(
    (data) =>
      data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-6 py-10">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 text-gray-800">
            <AiFillProduct  size={30}/>
            <h1 className="text-3xl font-bold">Order Management</h1>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Track, search and sort customer orders efficiently.
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full text-sm text-gray-800">
            <thead className="bg-gray-100 text-xs uppercase tracking-wide text-gray-600">
              <tr>
                {[
                  { key: "id", label: "Order ID" },
                  { key: "name", label: "Customer" },
                  { key: "email", label: "Email" },
                  { key: "phone", label: "Phone" },
                  { key: "orderDate", label: "Date" },
                  { key: "total", label: "Total" },
                  { key: "status", label: "Status" },
                  { key: null, label: "Actions" },
                ].map((header) => (
                  <th
                    key={header.label}
                    className="px-6 py-3 text-left font-medium cursor-pointer hover:bg-gray-200 transition"
                    onClick={() => header.key && handleSort(header.key)}
                  >
                    <div className="flex items-center gap-1">
                      {header.label}
                      {header.key && sortConfig.key === header.key && (
                        <>
                          {sortConfig.direction === "asc" ? (
                            <ChevronUp className="w-4 h-4 text-blue-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-blue-500" />
                          )}
                        </>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((data, index) => (
                <tr
                  key={data.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="px-6 py-4 font-semibold text-gray-700">{data.id}</td>
                  <td className="px-6 py-4">{data.name}</td>
                  <td className="px-6 py-4">{data.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{data.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap ">{data.orderDate}</td>
                  <td className="px-6 py-4 text-blue-700 font-semibold">
                    ${data.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                        data.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {data.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/orders/${data.id}`}
                      className="text-sm font-medium text-indigo-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;
