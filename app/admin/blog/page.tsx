"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Blog {
  _id: string;
  h1: string;
  title: string;
  slug: string;
  metaDescription: string;
  createdAt: string;
  image: string;
}

export default function Page() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blog");
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        setBlogs(data.blogs);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }

      // Update the blogs list after deletion
      setBlogs(blogs.filter((blog) => blog.slug !== slug));
    } catch (err) {
      console.error("Delete error:", err);
      alert(err instanceof Error ? err.message : "Failed to delete blog");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-app-button"></div>
            <span className="ml-3 text-app-text font-medium">Loading blogs...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-red-700 mb-2">Error Loading Blogs</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 p-6">
  <div className="max-w-7xl mx-auto">
    {/* Header Section */}
    <div className="mb-8">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-app-text mb-2">
              Blog Management
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Manage your blog posts and content
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="text-center sm:text-right">
              <p className="text-sm text-slate-500">Total Posts</p>
              <p className="text-xl sm:text-2xl font-bold text-app-button">{blogs.length}</p>
            </div>
            <Link
              href="/admin/blog/create"
              className="bg-app-button hover:bg-app-button-hover text-white font-semibold px-4 sm:px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New Post</span>
            </Link>
          </div>
        </div>
      </div>
    </div>

    {/* Content Section */}
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      {blogs.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-app-text mb-2">No blog posts found</h3>
          <p className="text-slate-500 mb-6">Get started by creating your first blog post.</p>
          <Link
            href="/admin/blog/create"
            className="bg-app-button hover:bg-app-button-hover text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Create First Post
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table hoverable className="min-w-full">
            <TableHead className="bg-slate-50">
              <TableHeadCell className="text-app-text font-semibold py-4 px-6">
                Featured Image
              </TableHeadCell>
              <TableHeadCell className="text-app-text font-semibold py-4 px-6">
                Post Details
              </TableHeadCell>
              <TableHeadCell className="text-app-text font-semibold py-4 px-6">
                Meta Description
              </TableHeadCell>
              <TableHeadCell className="text-app-text font-semibold py-4 px-6">
                Published Date
              </TableHeadCell>
              <TableHeadCell className="text-app-text font-semibold py-4 px-6">
                Actions
              </TableHeadCell>
            </TableHead>
            <TableBody className="divide-y divide-slate-200">
              {blogs.map((blog) => (
                <TableRow
                  key={blog._id}
                  className="bg-white hover:bg-slate-50 transition-colors duration-200"
                >
                  <TableCell className="py-4 px-6">
                    <div className="relative">
                      <Image
                        src={blog.image}
                        width={100}
                        height={75}
                        alt="Blog Image"
                        className="rounded-xl object-cover shadow-md border border-slate-200"
                      />
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4 px-6">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-app-text text-lg leading-tight">
                        {blog.h1}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded-md inline-block">
                        /{blog.slug}
                      </p>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4 px-6 max-w-xs">
                    <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                      {blog.metaDescription}
                    </p>
                  </TableCell>
                  
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a4 4 0 118 0v4m-9 4h10l2 8H5l2-8z" />
                      </svg>
                      <span className="text-app-text font-medium">
                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/admin/blog/edit/${blog.slug}`}
                        className="bg-app-button hover:bg-app-button-hover text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(blog.slug)}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Delete</span>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  </div>
</div>
  );
}