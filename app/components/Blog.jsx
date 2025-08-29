"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Eye,
  Calendar,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const Blog = () => {
  const t = useTranslations("HomePage");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  const INITIAL_DISPLAY_COUNT = 3;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blog");
        if (!response.ok) throw new Error("Failed to fetch blogs");
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

  const formatCount = (count) => {
    if (count === 0) return "0";
    if (count === 1) return "1";
    if (count < 1000) return count.toString();
    if (count < 1000000) return (count / 1000).toFixed(1) + "K";
    return (count / 1000000).toFixed(1) + "M";
  };

  const getUniqueViewsCount = (views) => {
    if (!views || !Array.isArray(views)) return 0;
    return new Set(views.map((view) => view.ip)).size;
  };

  if (error) {
    return (
      <section>
        <div className="text-center">
          <div className="inline-block rounded border border-red-200 bg-red-50 p-3 dark:border-red-800/30 dark:bg-red-900/20">
            <h3 className="text-lg font-bold text-red-800 dark:text-red-200">
              Error Loading Blogs
            </h3>
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background sm:mx-8 dark:bg-background-dark">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-bold text-primary md:text-4xl lg:text-5xl">
              {t("blogHeading")}
            </h2>
            <p className="text-sm text-text-secondary dark:text-text-inverse/70 md:text-base">
              Discover our latest insights and stories
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link href={"/blogs"}>
              <div className="group inline-flex transform items-center gap-3 rounded-2xl border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-2xl dark:border-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:hover:shadow-blue-900/25 md:px-6 md:py-3 md:text-base">
                <span>View All</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 md:h-5 md:w-5" />
              </div>
            </Link>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-primary dark:border-gray-700 dark:border-t-primary"></div>
          </div>
        )}

        {!loading && blogs.length > 0 && (
          <div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {(showAll ? blogs : blogs.slice(0, INITIAL_DISPLAY_COUNT)).map(
                (blog) => (
                  <Link href={`/blog/${blog.slug}`} key={blog.slug}>
                    <article className="group relative h-full overflow-hidden rounded border border-gray-200 bg-background transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-background-dark">
                      {/* Image */}
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <Image
                          src={blog.image || "/sydney.jpg"}
                          alt={blog.metaTitle || blog.h1 || "Blog post"}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-3">
                        <div className="mb-2">
                          <h3 className="mb-1 line-clamp-2 text-base font-semibold leading-tight text-text dark:text-text-inverse">
                            {blog.h1 || blog.metaTitle}
                          </h3>
                          {blog.metaDescription && (
                            <p className="line-clamp-2 text-xs leading-relaxed text-text-secondary dark:text-text-inverse">
                              {blog.metaDescription}
                            </p>
                          )}
                        </div>

                        {/* Date */}
                        <div className="mb-2 flex items-center text-xs text-primary">
                          <Calendar className="mr-1 h-3 w-3" />
                          <time dateTime={blog.createdAt}>
                            {new Date(blog.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </time>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
                          <div className="flex space-x-2 text-xs">
                            <div className="flex items-center rounded bg-primary-light px-2 py-0.5 dark:bg-primary-light/20">
                              <MessageCircle className="mr-1 h-3 w-3 text-primary dark:text-gray-100" />
                              <span className="text-primary dark:text-gray-100">
                                {formatCount(blog.comments?.length || 0)}
                              </span>
                            </div>
                            <div className="flex items-center rounded bg-background-secondary px-2 py-0.5 dark:bg-primary-light/20">
                              <Eye className="mr-1 h-3 w-3 text-text-secondary dark:text-gray-100" />
                              <span className="text-text-secondary dark:text-gray-100">
                                {formatCount(getUniqueViewsCount(blog.views))}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center text-xs font-medium text-primary">
                            Read
                            <ArrowUpRight className="ml-0.5 h-3 w-3" />
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ),
              )}
            </div>

            {blogs.length > INITIAL_DISPLAY_COUNT && (
              <div className="flex justify-center pt-3">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-sm font-medium text-text-inverse hover:bg-primary-hover"
                >
                  <span>
                    {showAll
                      ? "Show Less"
                      : `Show More (${blogs.length - INITIAL_DISPLAY_COUNT})`}
                  </span>
                  {showAll ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {!loading && blogs.length === 0 && (
          <div className="py-4 text-center">
            <div className="mx-auto max-w-sm rounded border border-gray-200 bg-primary-light p-4 dark:border-gray-700 dark:bg-primary-light/20">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-text-inverse">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 01-2-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h3 className="mb-1 text-lg font-bold text-primary">
                No Blogs Available
              </h3>
              <p className="text-sm text-text-secondary">
                Check back soon for updates!
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
