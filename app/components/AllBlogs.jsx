"use client";
import { useEffect, useState } from "react";
import {
  MdOutlineArrowOutward,
  MdSearch,
  MdViewModule,
  MdViewList,
} from "react-icons/md";

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const blogsPerPage = 6;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blog");
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        setBlogs(data.blogs);
        setFilteredBlogs(data.blogs);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    let filtered = blogs;

    if (searchTerm) {
      filtered = filtered.filter(
        (blog) =>
          blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.category?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredBlogs(filtered);
    setCurrentPage(1);
  }, [searchTerm, blogs]);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) {
    return (
      <div className="mt-20 min-h-screen bg-background dark:bg-background-dark">
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-md">
            <div className="rounded-2xl border border-gray-200 bg-background p-8 text-center shadow-lg dark:border-gray-600 dark:bg-background-dark">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
                <svg
                  className="h-8 w-8 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="dark:text-text-dark mb-2 text-xl font-semibold text-text">
                Error Loading Articles
              </h2>
              <p className="dark:text-text-secondary-dark mb-6 text-text-secondary">
                {error}
              </p>
              <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-text-inverse transition-colors hover:bg-primary-hover">
                Go Back Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-32 min-h-screen bg-background-secondary dark:bg-background-dark">
      {/* Header Section */}
      <div className="border-b border-gray-200 bg-background dark:border-gray-600 dark:bg-background-dark">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-light px-4 py-2 text-sm font-medium text-primary dark:bg-primary-light dark:text-primary">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary"></div>
              Knowledge Hub
            </div>
            <h1 className="mb-6 text-4xl font-bold text-text dark:text-gray-200 md:text-5xl lg:text-6xl">
              Professional <span className="text-primary">Insights</span>
            </h1>
            <p className="dark:text-text-secondary-dark mx-auto max-w-2xl text-xl leading-relaxed text-text-secondary">
              Expert articles and industry insights to drive your business
              forward with proven strategies and best practices.
            </p>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="border-b border-gray-200 bg-background dark:border-gray-600 dark:bg-background-dark">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
            {/* Search */}
            <div className="relative max-w-md flex-1">
              <MdSearch className="dark:text-text-secondary-dark absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-text-secondary" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="dark:text-text-dark dark:placeholder-text-secondary-dark w-full rounded-lg border border-gray-200 bg-background-secondary py-3 pl-12 pr-4 text-text placeholder-text-secondary transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-background-dark"
              />
            </div>

            {/* Results Count */}
            {!loading && filteredBlogs.length > 0 && (
              <div className="dark:text-text-secondary-dark text-sm text-text-secondary">
                {filteredBlogs.length} article
                {filteredBlogs.length !== 1 ? "s" : ""} found
              </div>
            )}

            {/* View Toggle */}
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-background-secondary p-1 dark:border-gray-600 dark:bg-background-dark">
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded-md p-2 transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary text-text-inverse shadow-sm"
                    : "dark:text-text-secondary-dark dark:hover:text-text-dark text-text-secondary hover:text-text"
                }`}
              >
                <MdViewModule className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`rounded-md p-2 transition-colors ${
                  viewMode === "list"
                    ? "bg-primary text-text-inverse shadow-sm"
                    : "dark:text-text-secondary-dark dark:hover:text-text-dark text-text-secondary hover:text-text"
                }`}
              >
                <MdViewList className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3">
              <div className="border-3 h-8 w-8 animate-spin rounded-full border-primary-light border-t-primary"></div>
              <span className="dark:text-text-secondary-dark text-text-secondary">
                Loading articles...
              </span>
            </div>
          </div>
        )}

        {!loading && currentBlogs.length > 0 && (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {currentBlogs.map((blog, index) => (
                  <article
                    key={`${blog.slug}-${index}`}
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-600 dark:bg-background-dark"
                  >
                    <div className="cursor-pointer">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={
                            blog.image ||
                            "/placeholder.svg?height=200&width=400&query=blog article"
                          }
                          alt={blog.title || blog.slug}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="mb-4 flex items-center gap-3">
                        <span className="rounded-full bg-primary-light px-3 py-1 text-sm font-medium text-primary dark:bg-primary-light">
                          {blog.category || "Article"}
                        </span>
                        {blog.readTime && (
                          <span className="dark:text-text-secondary-dark text-sm text-text-secondary">
                            {blog.readTime} min read
                          </span>
                        )}
                      </div>

                      <div className="group/title cursor-pointer">
                        <h2 className="mb-3 line-clamp-2 text-xl font-semibold text-text transition-colors duration-200 group-hover/title:text-primary dark:text-gray-200">
                          {blog.title || blog.slug}
                        </h2>
                      </div>

                      {blog.excerpt && (
                        <p className="dark:text-text-secondary-dark mb-4 line-clamp-3 text-sm text-text-secondary">
                          {blog.excerpt}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        {blog.publishedAt && (
                          <time className="dark:text-text-secondary-dark text-sm text-text-secondary">
                            {new Date(blog.publishedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </time>
                        )}

                        <Link href={`/blog/${blog.slug}`}>
                          <span className="group/link inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-hover">
                            Read more
                            <MdOutlineArrowOutward className="h-4 w-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {currentBlogs.map((blog, index) => (
                  <article
                    key={`${blog.slug}-${index}`}
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-background shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-600 dark:bg-background-dark"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="flex-shrink-0 cursor-pointer md:w-80">
                        <div className="relative h-48 overflow-hidden md:h-full">
                          <img
                            src={
                              blog.image ||
                              "/placeholder.svg?height=200&width=320&query=blog article"
                            }
                            alt={blog.title || blog.slug}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col justify-between p-6">
                        <div>
                          <div className="mb-3 flex items-center gap-3">
                            <span className="rounded-full bg-primary-light px-3 py-1 text-sm font-medium text-primary dark:bg-primary-light">
                              {blog.category || "Article"}
                            </span>
                            {blog.readTime && (
                              <span className="dark:text-text-secondary-dark text-sm text-text-secondary">
                                {blog.readTime} min read
                              </span>
                            )}
                          </div>

                          <div className="group/title cursor-pointer">
                            <h2 className="dark:text-text-dark mb-3 text-2xl font-semibold text-text transition-colors duration-200 group-hover/title:text-primary">
                              {blog.title || blog.slug}
                            </h2>
                          </div>

                          {blog.excerpt && (
                            <p className="dark:text-text-secondary-dark mb-4 line-clamp-2 text-text-secondary">
                              {blog.excerpt}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          {blog.publishedAt && (
                            <time className="dark:text-text-secondary-dark text-sm text-text-secondary">
                              {new Date(blog.publishedAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </time>
                          )}

                          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-text-inverse transition-colors hover:bg-primary-hover">
                            Read Article
                            <MdOutlineArrowOutward className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        {!loading && filteredBlogs.length === 0 && (
          <div className="py-20 text-center">
            <div className="mx-auto max-w-md">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-gray-200 bg-background-secondary dark:border-gray-600 dark:bg-background-dark">
                <MdSearch className="dark:text-text-secondary-dark h-10 w-10 text-text-secondary" />
              </div>
              <h3 className="dark:text-text-dark mb-3 text-2xl font-semibold text-text">
                {searchTerm ? "No articles found" : "No articles available"}
              </h3>
              <p className="dark:text-text-secondary-dark mb-6 text-text-secondary">
                {searchTerm
                  ? `We couldn't find any articles matching "${searchTerm}". Try adjusting your search terms.`
                  : "We're working on bringing you fresh content. Check back soon!"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="rounded-lg bg-primary px-6 py-3 font-medium text-text-inverse transition-colors hover:bg-primary-hover"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`rounded-lg border px-4 py-2 transition-colors ${
                  currentPage === 1
                    ? "dark:text-text-secondary-dark cursor-not-allowed border-gray-200 text-text-secondary dark:border-gray-600"
                    : "dark:text-text-dark border-gray-200 text-text hover:bg-background-secondary dark:border-gray-600 dark:hover:bg-background-dark"
                }`}
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`h-10 w-10 rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-primary text-text-inverse"
                          : "dark:text-text-dark text-text hover:bg-background-secondary dark:hover:bg-background-dark"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`rounded-lg border px-4 py-2 transition-colors ${
                  currentPage === totalPages
                    ? "dark:text-text-secondary-dark cursor-not-allowed border-gray-200 text-text-secondary dark:border-gray-600"
                    : "dark:text-text-dark border-gray-200 text-text hover:bg-background-secondary dark:border-gray-600 dark:hover:bg-background-dark"
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
