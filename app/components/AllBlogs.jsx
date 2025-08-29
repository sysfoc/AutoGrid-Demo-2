"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { MdOutlineArrowOutward, MdSearch, MdViewModule, MdViewList } from "react-icons/md"
import Image from "next/image"

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([])
  const [filteredBlogs, setFilteredBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState("grid") // grid or list
  const blogsPerPage = 6

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blog")
        if (!response.ok) {
          throw new Error("Failed to fetch blogs")
        }
        const data = await response.json()
        setBlogs(data.blogs)
        setFilteredBlogs(data.blogs)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch blogs")
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  useEffect(() => {
    let filtered = blogs

    if (searchTerm) {
      filtered = filtered.filter(
        (blog) =>
          blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.slug?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredBlogs(filtered)
    setCurrentPage(1)
  }, [searchTerm, blogs])

  const indexOfLastBlog = currentPage * blogsPerPage
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog)
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 mt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600 dark:text-red-400"
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
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Blogs</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Go Back Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 mt-14">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Knowledge Hub
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Insights & <span className="text-green-600 dark:text-green-400">Articles</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Explore our collection of in-depth articles, tutorials, and industry insights crafted by our expert team.
            </p>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
              />
            </div>

            {/* Results Count */}
            {!loading && filteredBlogs.length > 0 && (
              <div className="text-gray-600 dark:text-gray-400 text-sm">
                {filteredBlogs.length} article{filteredBlogs.length !== 1 ? "s" : ""} found
              </div>
            )}

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-gray-600 text-green-600 dark:text-green-400 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <MdViewModule className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-white dark:bg-gray-600 text-green-600 dark:text-green-400 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <MdViewList className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-3 border-green-200 dark:border-green-800 rounded-full animate-spin border-t-green-600"></div>
              <span className="text-gray-600 dark:text-gray-400">Loading articles...</span>
            </div>
          </div>
        )}

        {!loading && currentBlogs.length > 0 && (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentBlogs.map((blog, index) => (
                  <article
                    key={`${blog.slug}-${index}`}
                    className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  >
                    <Link href={`/blog/${blog.slug}`}>
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={blog.image || "/placeholder.svg?height=200&width=400&query=blog article"}
                          alt={blog.title || blog.slug}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </Link>

                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                          {blog.category || "Article"}
                        </span>
                        {blog.readTime && (
                          <span className="text-gray-500 dark:text-gray-400 text-sm">{blog.readTime} min read</span>
                        )}
                      </div>

                      <Link href={`/blog/${blog.slug}`} className="group/title">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover/title:text-green-600 dark:group-hover/title:text-green-400 transition-colors duration-200 line-clamp-2 mb-3">
                          {blog.title || blog.slug}
                        </h2>
                      </Link>

                      {blog.excerpt && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">{blog.excerpt}</p>
                      )}

                      <div className="flex items-center justify-between">
                        {blog.publishedAt && (
                          <time className="text-gray-500 dark:text-gray-400 text-sm">
                            {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </time>
                        )}

                        <Link
                          href={`/blog/${blog.slug}`}
                          className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium transition-colors group/link"
                        >
                          Read more
                          <MdOutlineArrowOutward className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
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
                    className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row">
                      <Link href={`/blog/${blog.slug}`} className="md:w-80 flex-shrink-0">
                        <div className="relative h-48 md:h-full overflow-hidden">
                          <Image
                            src={blog.image || "/placeholder.svg?height=200&width=320&query=blog article"}
                            alt={blog.title || blog.slug}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </Link>

                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                              {blog.category || "Article"}
                            </span>
                            {blog.readTime && (
                              <span className="text-gray-500 dark:text-gray-400 text-sm">{blog.readTime} min read</span>
                            )}
                          </div>

                          <Link href={`/blog/${blog.slug}`} className="group/title">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white group-hover/title:text-green-600 dark:group-hover/title:text-green-400 transition-colors duration-200 mb-3">
                              {blog.title || blog.slug}
                            </h2>
                          </Link>

                          {blog.excerpt && (
                            <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">{blog.excerpt}</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          {blog.publishedAt && (
                            <time className="text-gray-500 dark:text-gray-400 text-sm">
                              {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </time>
                          )}

                          <Link
                            href={`/blog/${blog.slug}`}
                            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Read Article
                            <MdOutlineArrowOutward className="w-4 h-4" />
                          </Link>
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
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <MdSearch className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                {searchTerm ? "No articles found" : "No articles available"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm
                  ? `We couldn't find any articles matching "${searchTerm}". Try adjusting your search terms.`
                  : "We're working on bringing you fresh content. Check back soon!"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  currentPage === 1
                    ? "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-green-600 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  currentPage === totalPages
                    ? "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogsPage
