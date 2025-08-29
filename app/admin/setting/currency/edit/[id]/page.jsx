"use client";

import { Button, Label, Select, TextInput } from "flowbite-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const currencyId = params?.id;

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [value, setValue] = useState("");
  const [isDefault, setIsDefault] = useState("no");
  const [originalIsDefault, setOriginalIsDefault] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const res = await fetch(`/api/currency/${currencyId}`);
        const data = await res.json();
        setName(data.name);
        setSymbol(data.symbol);
        setValue(data.value);
        setIsDefault(data.isDefault ? "yes" : "no");
        setOriginalIsDefault(data.isDefault);
      } catch (error) {
        console.error("Failed to load currency", error);
        setError("Failed to load currency details");
      }
    };

    if (currencyId) fetchCurrency();
  }, [currencyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const updatedData = {
      name,
      symbol,
      value: parseFloat(parseFloat(value).toFixed(5)),
      isDefault: isDefault === "yes",
    };

    if (updatedData.isDefault && !originalIsDefault) {
      if (!window.confirm(
        "Setting this as the default currency will recalculate all other currency values. Continue?"
      )) {
        setLoading(false);
        return;
      }
    }
    
    if (!updatedData.isDefault && originalIsDefault) {
      setError("You cannot unset the default currency. Please set another currency as default first.");
      setIsDefault("yes");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/currency/${currencyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        router.push("/admin/setting/currency");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Update failed");
      }
    } catch (error) {
      setError("Error submitting update");
      console.error("Error submitting update:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="my-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Edit Currency</h2>
        <Link
          href={"/admin/setting/currency"}
          className="rounded-lg bg-blue-500 p-3 text-sm text-white"
        >
          View All
        </Link>
      </div>

      {error && (
        <div className="my-3 rounded-lg bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
        <div>
          <Label htmlFor="name">Name</Label>
          <TextInput
            type="text"
            id="name"
            placeholder="USD"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="symbol">Symbol</Label>
          <TextInput
            type="text"
            id="symbol"
            placeholder="$"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="value">Value</Label>
          <TextInput
            type="number"
            id="value"
            placeholder="1"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            disabled={originalIsDefault}
          />
          {originalIsDefault && (
            <p className="mt-1 text-sm text-gray-500">
              Value is always 1 for the default currency.
            </p>
          )}
          {isDefault === "yes" && !originalIsDefault && (
            <p className="mt-1 text-sm text-gray-500">
              When set as default, this value will become 1 and all other currencies will be recalculated.
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="is-default">Is Default?</Label>
          <Select
            id="is-default"
            value={isDefault}
            onChange={(e) => setIsDefault(e.target.value)}
            disabled={originalIsDefault} 
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </Select>
          {originalIsDefault && (
            <p className="mt-1 text-sm text-gray-500">
              To change the default currency, set another currency as default.
            </p>
          )}
        </div>
        <div>
          <Button 
            type="submit" 
            className="mt-3 w-full" 
            color={"dark"}
            disabled={loading}
          >
            {loading ? "Processing..." : "Save Updates"}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default Page;