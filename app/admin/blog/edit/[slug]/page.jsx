"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Label, Select, Textarea, TextInput } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

const LazyJoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function EditBlogPage() {
  const router = useRouter();
  const { slug } = useParams();
  const blogSlug = slug;
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [h1, setH1] = useState("");
  const [currentSlug, setCurrentSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [categories, setCategories] = useState([]);

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

  useEffect(() => {
    if (!blogSlug) {
      setLoading(false);
      return;
    }
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blog/${blogSlug}`);
        const data = await response.json();
        if (response.ok) {
          setH1(data.h1);
          setCurrentSlug(data.slug);
          setMetaTitle(data.metaTitle);
          setMetaDescription(data.metaDescription);
          setContent(data.content);
          setCategoryId(data.categoryId);
          setExistingImage(data.image);
        } else {
          toast.error("Failed to fetch blog data");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast.error("Error fetching blog data");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [blogSlug]);

  const handleCategoryChange = (e) => {
    setCategoryId(e.target.value);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("h1", h1);
    formData.append("slug", currentSlug);
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);
    formData.append("content", content);
    formData.append("categoryId", categoryId);
    if (image) formData.append("image", image);

    try {
      const response = await fetch(`/api/blog/${blogSlug}`, {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Blog updated successfully!");
        router.push("/admin/blog");
      } else {
        toast.error(result.error || "Failed to update blog");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Something went wrong. Try again.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="my-10">
  <div className="flex items-center justify-between">
    <h2 className="text-2xl font-bold text-app-text">Edit Blog Post</h2>
    <Link
      href="/admin/blog"
      className="rounded-lg bg-app-button hover:bg-app-button-hover p-3 text-sm text-white transition-colors duration-200"
    >
      View All
    </Link>
  </div>

  <form className="mt-8 flex flex-col gap-y-5" onSubmit={handleUpdate}>
    <div>
      <Label htmlFor="h1" className="text-app-text">H1 Title</Label>
      <TextInput
        id="h1"
        value={h1}
        onChange={(e) => setH1(e.target.value)}
      />
    </div>

    <div>
      <Label htmlFor="slug" className="text-app-text">Slug</Label>
      <TextInput
        id="slug"
        value={currentSlug}
        onChange={(e) => setCurrentSlug(e.target.value)}
      />
    </div>

    <div>
      <Label htmlFor="metaTitle" className="text-app-text">Meta Title</Label>
      <TextInput
        id="metaTitle"
        value={metaTitle}
        onChange={(e) => setMetaTitle(e.target.value)}
      />
    </div>

    <div>
      <Label htmlFor="metaDescription" className="text-app-text">Meta Description</Label>
      <Textarea
        id="metaDescription"
        value={metaDescription}
        onChange={(e) => setMetaDescription(e.target.value)}
      />
    </div>

    <div>
      <Label className="text-app-text">Content:</Label>
      <LazyJoditEditor
        value={content}
        config={{ height: 300 }}
        onBlur={(newContent) => setContent(newContent)}
      />
    </div>

    <div>
      <Label htmlFor="categoryId" className="text-app-text">Select Category:</Label>
      <Select
        id="categoryId"
        value={categoryId}
        onChange={handleCategoryChange}
        required
      >
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </Select>
    </div>
    
    {existingImage && (
      <div>
        <Label className="text-app-text">Existing Image</Label>
        <Image
          src={existingImage}
          width={150}
          height={150}
          alt="Existing Image"
          className="mt-2 rounded-lg border border-gray-200"
        />
      </div>
    )}

    <div>
      <Label htmlFor="image" className="text-app-text">Upload New Image</Label>
      <TextInput
        type="file"
        id="image"
        onChange={(e) => setImage(e.target.files[0])}
      />
    </div>

    <div>
      <Button 
        color="dark" 
        className="w-full bg-app-button hover:bg-app-button-hover border-0 focus:ring-app-button transition-colors duration-200" 
        type="submit"
      >
        Update Changes
      </Button>
    </div>
  </form>
</div>
  );
}