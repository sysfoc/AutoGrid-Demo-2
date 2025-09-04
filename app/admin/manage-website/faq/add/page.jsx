"use client";
import { Button, Label, Select, TextInput } from "flowbite-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import React, { Suspense, useState } from "react";
import { toast } from "react-toastify";

const LazyJoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const Page = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(0);
  const [loading, setLoading] = useState(false);

  const config = {
    readonly: false,
    placeholder: "Start typing...",
    height: 500,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!title || !content.trim()) {
      toast.error("Title and content are required!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, order }),
      });

      if (!res.ok) {
        const errorData = await res.text();
        console.error("API Response:", errorData);
        throw new Error(`API Error: ${res.status}`);
      }

      const data = await res.json();
      toast.success("FAQ added successfully!");
      setTitle("");
      setContent("");
      setOrder(0);
    } catch (error) {
      console.error("Error submitting FAQ:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="my-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text">Add New FAQ</h2>
        <Link
          href={"/admin/manage-website/faq"}
          className="rounded-lg bg-primary hover:bg-primary-hover p-3 text-sm text-text-inverse transition-colors duration-200"
        >
          View All
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
        <div>
          <Label htmlFor="title" className="text-text">Title:</Label>
          <TextInput
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-text"
          />
        </div>
        <div>
          <p className="text-sm text-text">Content:</p>
          <Suspense fallback={<p className="text-text">Loading editor...</p>}>
            <LazyJoditEditor
              value={content}
              config={config}
              tabIndex={1}
              onBlur={(newContent) => setContent(newContent || "")} // Ensure content updates correctly
            />
          </Suspense>
        </div>
        <div>
          <Label htmlFor="order" className="text-text">Order:</Label>
          <Select
            id="order"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="text-text"
          >
            {[...Array(6).keys()].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Button
            type="submit"
            className="mt-3 w-full bg-primary hover:bg-primary-hover border-primary hover:border-primary-hover"
            disabled={loading}
          >
            <span className="text-text-inverse">
              {loading ? "Submitting..." : "Submit"}
            </span>
          </Button>
        </div>
      </form>
    </section>
  );
};

export default Page;