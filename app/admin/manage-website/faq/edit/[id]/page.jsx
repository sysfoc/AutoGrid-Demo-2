"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Label, Select, TextInput } from "flowbite-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { toast } from "react-toastify";

const LazyJoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const Page = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [order, setOrder] = useState("0");
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const res = await fetch(`/api/faq/${id}`);
        const data = await res.json();
        setTitle(data.faq.title);
        setContent(data.faq.content);
        setOrder(String(data.faq.order));
      } catch (error) {
        console.error("Error fetching FAQ:", error);
      }
    };

    fetchFaq();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/faq/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, order: Number(order) }),
      });

      if (res.ok) {
        toast.success("FAQ updated successfully!");
        router.push("/admin/manage-website/faq");
      } else {
        toast.error("FAQ failed to update");
        console.error("Failed to update FAQ");
      }
    } catch (error) {
      console.error("Error updating FAQ:", error);
      toast.error("Error overall");
    }
  };

  return (
   <section className="my-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text">Update FAQ</h2>
        <Link
          href="/admin/manage-website/faq"
          className="rounded-lg bg-primary hover:bg-primary-hover p-3 text-sm text-text-inverse transition-colors duration-200"
        >
          Go Back
        </Link>
      </div>

      <form onSubmit={handleUpdate} className="mt-5 flex flex-col gap-3">
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
              tabIndex={1}
              onBlur={(newContent) => setContent(newContent)}
            />
          </Suspense>
        </div>

        <div>
          <Label htmlFor="order" className="text-text">Order:</Label>
          <Select
            id="order"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="text-text"
          >
            {[...Array(6).keys()].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </Select>
        </div>

        <Button 
          type="submit" 
          className="mt-3 w-full bg-primary hover:bg-primary-hover border-primary hover:border-primary-hover"
        >
          <span className="text-text-inverse">
            Update Changes
          </span>
        </Button>
      </form>
    </section>
  );
};

export default Page;