"use client";
import React, { useState } from "react";
import { Label, TextInput, Button, FileInput, Alert } from "flowbite-react";
import Link from "next/link";

const Page = () => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("logo", logo);

    try {
      const response = await fetch("/api/brand", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Brand added successfully!");
        setName("");
        setSlug("");
        setLogo(null);
      } else {
        setMessage(data.error || "Something went wrong!");
      }
    } catch (error) {
      setMessage("Error adding brand");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Add New Brand</h2>
        <Link
          href="/admin/listing/brand"
          className="rounded-lg bg-blue-500 p-3 text-sm text-white"
        >
          View All
        </Link>
      </div>

      {message && <Alert color="info">{message}</Alert>}

      <form className="mt-5 flex flex-col gap-3" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name">Name:</Label>
          <TextInput
            id="name"
            placeholder="Toyota"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="slug">Slug:</Label>
          <TextInput
            id="slug"
            placeholder="toyota"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="logo">Logo:</Label>
          <FileInput
            id="logo"
            accept="image/*"
            onChange={(e) => setLogo(e.target.files[0])}
            required
          />
        </div>

        <Button
          type="submit"
          className="mt-3 w-full"
          color="dark"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Brand"}
        </Button>
      </form>
    </section>
  );
};

export default Page;
