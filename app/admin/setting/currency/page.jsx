"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import Link from "next/link";

export default function Categories() {
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    fetch("/api/currency")
      .then((res) => res.json())
      .then((data) => setCurrencies(data));
  }, []);

  const deleteCurrency = async (id) => {
    await fetch(`/api/currency/${id}`, { method: "DELETE" });
    setCurrencies(currencies.filter((c) => c._id !== id));
  };

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Currency</h2>
        <Link
          href={"/admin/setting/currency/add"}
          className="rounded-lg bg-yellow-500 p-3 text-sm text-white"
        >
          Add New
        </Link>
      </div>

      <div className="mt-5">
        <Table>
          <TableHead>
            <TableHeadCell>Serial</TableHeadCell>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Symbol</TableHeadCell>
            <TableHeadCell>Value</TableHeadCell>
            <TableHeadCell>isDefault?</TableHeadCell>
            <TableHeadCell>Actions</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y">
            {currencies.map((currency, i) => (
              <TableRow
                key={currency._id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <TableCell>{i + 1}</TableCell>
                <TableCell>{currency.name}</TableCell>
                <TableCell>{currency.symbol}</TableCell>
                <TableCell>{currency.value}</TableCell>
                <TableCell>{currency.isDefault ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-x-5">
                    <Link
                      href={`/admin/setting/currency/edit/${currency._id}`}
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteCurrency(currency._id)}
                      className="font-medium text-red-500 hover:underline dark:text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
