import Image from "next/image";
import { IoMdAlarm } from "react-icons/io";
import { Avatar } from "flowbite-react";
import ClientBlog from "./ClientBlog";
import CommentSection from "../../components/CommentSection";
import { Metadata } from "next";
import Blog from "../../models/Blog";
import Category from "../../models/Category";
import connectDB from "../../lib/mongodb";

type ParamsType = {
  slug: string;
};

interface BlogType {
  _id: string;
  title: string;
  h1?: string;
  metaTitle?: string;
  metaDescription?: string;
  categoryId: string;
  category?: string;
  author?: string;
  image?: string;
  createdAt: string;
  content: string;
  slug: string;
}

async function getBlogWithCategory(slug: string): Promise<BlogType | null> {
  await connectDB();

  const blog = await Blog.findOne({ slug });
  if (!blog) return null;

  const category = await Category.findById(blog.categoryId);

  return {
    ...blog.toObject(),
    category: category?.name || "Uncategorized",
  };
}

export async function generateMetadata({ params }: { params: ParamsType }): Promise<Metadata> {
  const blog = await getBlogWithCategory(params.slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription,
  };
}

const Page = async ({ params }: { params: ParamsType }) => {
  const blog = await getBlogWithCategory(params.slug);

  if (!blog) return null;

  return (
    <section className="mx-4 my-14 mt-32 sm:mx-16">
      <div className="grid grid-cols-1 items-center gap-x-10 gap-y-5 py-5 md:grid-cols-2">
        <div className="overflow-hidden rounded-lg">
          <Image
            src={blog.image || "/default.jpg"}
            alt={blog.title || "Blog image"}
            width={500}
            height={300}
            className="size-full"
          />
        </div>
        <div>
          <div className="flex flex-row items-center gap-3">
            <button className="inline-flex items-center rounded-lg bg-blue-950 px-3 py-2 text-center text-sm font-medium text-white dark:bg-red-500">
              {blog.category}
            </button>
            <div className="flex items-center gap-2">
              <IoMdAlarm fontSize={18} />
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <h1 className="mt-3 text-2xl font-bold sm:mt-5 sm:text-4xl">
            {blog.h1 || blog.metaTitle}
          </h1>
          <div className="mt-5 flex items-center gap-10">
            <div className="flex items-center gap-3">
              <Avatar size={"sm"} rounded />
              <span>{blog.author || "Anonymous"}</span>
            </div>
            <ClientBlog slug={blog.slug} />
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="mt-5 max-w-5xl mx-auto">
        <div 
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>

      <CommentSection slug={blog.slug} />
    </section>
  );
};

export default Page;
