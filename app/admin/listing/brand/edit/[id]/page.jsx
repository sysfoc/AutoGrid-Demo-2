"use client";
import React, { useState, useEffect } from "react";
import { Label, TextInput, Button, FileInput } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";

const Page = () => {
  const [previewLogo, setPreviewLogo] = useState("/Luxury SUV.webp");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    slug: "",
    logo: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!id) return; // Ensure id is available

    fetch(`/api/brand/${id}`) // Using RESTful API convention
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setFormData({
            id: data._id || "",
            name: data.name || "",
            slug: data.slug || "",
            logo: data.logo || "/Luxury SUV.webp",
          });
          setPreviewLogo(data.logo || "/Luxury SUV.webp");
        }
      })
      .catch((error) => {
        console.error("Error fetching brand:", error);
        toast.error("Failed to load brand details");
      });
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("id", formData.id);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("slug", formData.slug);
    if (selectedFile) {
      formDataToSend.append("logo", selectedFile);
    }

    try {
      const response = await fetch(`/api/brand/${id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Brand updated successfully!");
        router.push("/admin/listing/brand");
      } else {
        toast.error(data.error || "Failed to update brand");
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("An error occurred while updating the brand");
    }
  };

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Edit Brands</h2>
        <Link
          href={"/admin/listing/brand"}
          className="rounded-lg bg-blue-500 p-3 text-sm text-white"
        >
          View All
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
        <div>
          <Label htmlFor="name">Name:</Label>
          <TextInput
            id="name"
            placeholder="Toyota"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug:</Label>
          <TextInput
            id="slug"
            placeholder="toyota"
            value={formData.slug}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <p className="font-semibold">Existing Logo</p>
          <Image
            width={150}
            height={150}
            alt="logo"
            src={previewLogo}
            className="my-3"
          />
          <Label htmlFor="logo">Change Logo:</Label>
          <FileInput id="logo" accept="image/*" onChange={handleLogoChange} />
        </div>
        <div>
          <Button type="submit" className="mt-3 w-full" color={"dark"}>
            Update Changes
          </Button>
        </div>
      </form>
    </section>
  );
};

export default Page;
