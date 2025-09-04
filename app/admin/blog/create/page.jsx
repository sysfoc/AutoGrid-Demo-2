"use client";
import {
  Button,
  FileInput,
  Label,
  Select,
  Textarea,
  TextInput,
} from "flowbite-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import React, { Suspense, useState, useEffect } from "react";
import { toast } from "react-toastify";

const LazyJoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const Page = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: e.target.value,
    }));
  };

  const [content, setContent] = useState("");

  const [formData, setFormData] = useState({
    slug: "",
    metaTitle: "",
    metaDescription: "",
    h1: "",
    categoryId: "",
    image: null,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    formDataToSend.append("slug", formData.slug);
    formDataToSend.append("metaTitle", formData.metaTitle);
    formDataToSend.append("metaDescription", formData.metaDescription);
    formDataToSend.append("h1", formData.h1);
    formDataToSend.append("content", content);
    formDataToSend.append("categoryId", formData.categoryId);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("🎉 Blog added successfully!", {
          position: "top-right",
          autoClose: 3000,
          theme: "light",
        });

        setFormData({
          slug: "",
          metaTitle: "",
          metaDescription: "",
          h1: "",
          categoryId: "",
          image: null,
        });
        setContent("");
      } else {
        toast.error(`❌ ${result.error || "Failed to add blog"}`, {
          position: "top-right",
          autoClose: 3000,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error submitting blog:", error);
      toast.error("❌ An unexpected error occurred!", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
    }
  };

  const config = {
    readonly: false,
    placeholder: "Start typing...",
    height: 500,
  };

  return (
    <section className="my-10">
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-2xl font-bold text-text">Add New Post</h2>
    </div>
    <div>
      <Link
        href={"/admin/blog"}
        className="rounded-lg bg-primary hover:bg-primary-hover p-3 text-sm text-text-inverse transition-colors duration-200"
      >
        View All
      </Link>
    </div>
  </div>
  <form className="mt-5 flex flex-col gap-3" onSubmit={handleSubmit}>
    <div>
      <Label htmlFor="title" className="text-text">H1/Title:</Label>
      <TextInput onChange={handleChange} id="h1" type="text" />
    </div>
    <div>
      <Label htmlFor="slug" className="text-text">Slug:</Label>
      <TextInput onChange={handleChange} id="slug" type="text" />
    </div>
    <div>
      <Label htmlFor="title" className="text-text">meta Title:</Label>
      <TextInput onChange={handleChange} id="metaTitle" type="text" />
    </div>
    <div>
      <Label htmlFor="title" className="text-text">meta description:</Label>
      <TextInput onChange={handleChange} id="metaDescription" type="text" />
    </div>
    
    <div>
      <p className="text-sm text-text">Content:</p>
      <Suspense fallback={<p className="text-text">Loading editor...</p>}>
        <LazyJoditEditor
          value={content}
          config={config}
          tabIndex={1}
          onBlur={(newContent) => setContent(newContent)}
          onChange={() => {}}
        />
      </Suspense>
    </div>
    
    <div>
      <Label htmlFor="image" className="text-text">Select Image:</Label>
      <FileInput onChange={handleFileChange} id="image" accept="image/*" />
    </div>
    <div>
      <Label htmlFor="categoryId" className="text-text">Select Category:</Label>
      <Select id="categoryId" onChange={handleCategoryChange} required>
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </Select>
    </div>
    
    <div>
      <Button 
        type="submit" 
        className="mt-3 w-full bg-primary hover:bg-primary-hover border-0 focus:ring-primary transition-colors duration-200" 
        color={"dark"}
      >
        Submit
      </Button>
    </div>
  </form>
</section>
  );
};

export default Page;
