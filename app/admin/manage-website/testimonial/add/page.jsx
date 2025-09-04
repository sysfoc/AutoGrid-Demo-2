"use client";
import { Button, FileInput, Label, Textarea, TextInput } from "flowbite-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    content: "",
    image: null,
  });

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate Form
    if (
      !formData.name ||
      !formData.designation ||
      !formData.content ||
      !formData.image
    ) {
      toast.error("All fields are required!");
      return;
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("designation", formData.designation);
    form.append("content", formData.content);
    form.append("image", formData.image);

    try {
      const res = await fetch("/api/testimonial", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Testimonial added successfully!");
        setFormData({ name: "", designation: "", content: "", image: null });
      } else {
        toast.error(data.error || "Failed to add testimonial.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="my-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text">Add New Testimonial</h2>
        <Link
          href={"/admin/manage-website/testimonial"}
          className="rounded-lg bg-primary hover:bg-primary-hover p-3 text-sm text-text-inverse transition-colors duration-200"
        >
          View All
        </Link>
      </div>
      <form className="mt-5 flex flex-col gap-3" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name" className="text-text">Name:</Label>
          <TextInput
            id="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="text-text"
          />
        </div>
        <div>
          <Label htmlFor="designation" className="text-text">Designation:</Label>
          <TextInput
            id="designation"
            type="text"
            value={formData.designation}
            onChange={handleChange}
            className="text-text"
          />
        </div>
        <div>
          <Label htmlFor="content" className="text-text">Content:</Label>
          <Textarea
            id="content"
            rows={5}
            value={formData.content}
            onChange={handleChange}
            className="text-text"
          />
        </div>
        <div>
          <Label htmlFor="image" className="text-text">Image:</Label>
          <FileInput id="image" accept="image/*" onChange={handleChange} className="text-text" />
        </div>
        <Button 
          type="submit" 
          className="mt-3 w-full bg-primary hover:bg-primary-hover border-primary hover:border-primary-hover"
        >
          <span className="text-text-inverse">
            Submit
          </span>
        </Button>
      </form>
    </section>
  );
};

export default Page;