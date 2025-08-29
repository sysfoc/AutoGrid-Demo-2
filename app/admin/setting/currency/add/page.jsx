"use client";

import { Button, Label, Select, TextInput } from "flowbite-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [value, setValue] = useState("");
  const [isDefault, setIsDefault] = useState("no");
  const [existingDefault, setExistingDefault] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkDefaultCurrency = async () => {
      try {
        const res = await fetch("/api/currency/default");
        const data = await res.json();
        if (data && data._id) {
          setExistingDefault(true);
        }
      } catch (error) {
        console.error("Failed to check default currency:", error);
      }
    };

    checkDefaultCurrency();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = {
      name,
      symbol,
      value: parseFloat(parseFloat(value).toFixed(5)),
      isDefault: isDefault === "yes",
    };

    if (data.isDefault && existingDefault) {
      if (!window.confirm(
        "Setting this as the default currency will recalculate all other currency values. Continue?"
      )) {
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/currency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/admin/setting/currency"); 
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to add currency");
      }
    } catch (error) {
      setError("Error submitting form");
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="my-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Add New Currency</h2>
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
            autoComplete="on"
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
            placeholder="Add Currency Symbol (Like $)"
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
            step="0.001"
            required
          />
          {!existingDefault && isDefault === "yes" && (
            <p className="mt-1 text-sm text-gray-500">
              As the first default currency, this value will be set to 1.
            </p>
          )}
          {existingDefault && isDefault === "yes" && (
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
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </Select>
        </div>
        <div>
          <Button 
            type="submit" 
            className="mt-3 w-full" 
            color={"dark"}
            disabled={loading}
          >
            {loading ? "Processing..." : "Add Currency"}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default Page;