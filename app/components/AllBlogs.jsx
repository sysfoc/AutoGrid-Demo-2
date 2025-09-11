"use client"
import { useEffect, useState } from "react"
import { MdOutlineArrowOutward, MdSearch, MdViewModule, MdViewList } from "react-icons/md"

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
          blog.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.category?.toLowerCase().includes(searchTerm.toLowerCase()),
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
      <div className="min-h-screen bg-background dark:bg-background-dark mt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto">
            <div className="bg-background dark:bg-background-dark rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 p-8 text-center">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
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
              <h2 className="text-xl font-semibold text-text dark:text-text-dark mb-2">Error Loading Articles</h2>
              <p className="text-text-secondary dark:text-text-secondary-dark mb-6">{error}</p>
              <button className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-text-inverse px-6 py-3 rounded-lg font-medium transition-colors">
                Go Back Home
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-secondary dark:bg-background-dark mt-32">
      {/* Header Section */}
      <div className="bg-background dark:bg-background-dark border-b border-gray-200 dark:border-gray-600">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary-light dark:bg-primary-light text-primary dark:text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              Knowledge Hub
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text dark:text-gray-200 mb-6">
              Professional <span className="text-primary">Insights</span>
            </h1>
            <p className="text-xl text-text-secondary dark:text-text-secondary-dark max-w-2xl mx-auto leading-relaxed">
              Expert articles and industry insights to drive your business forward with proven strategies and best practices.
            </p>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="bg-background dark:bg-background-dark border-b border-gray-200 dark:border-gray-600">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary dark:text-text-secondary-dark w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-background-secondary dark:bg-background-dark border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text dark:text-text-dark placeholder-text-secondary dark:placeholder-text-secondary-dark transition-all"
              />
            </div>

            {/* Results Count */}
            {!loading && filteredBlogs.length > 0 && (
              <div className="text-text-secondary dark:text-text-secondary-dark text-sm">
                {filteredBlogs.length} article{filteredBlogs.length !== 1 ? "s" : ""} found
              </div>
            )}

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-background-secondary dark:bg-background-dark rounded-lg p-1 border border-gray-200 dark:border-gray-600">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary text-text-inverse shadow-sm"
                    : "text-text-secondary dark:text-text-secondary-dark hover:text-text dark:hover:text-text-dark"
                }`}
              >
                <MdViewModule className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-primary text-text-inverse shadow-sm"
                    : "text-text-secondary dark:text-text-secondary-dark hover:text-text dark:hover:text-text-dark"
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
              <div className="w-8 h-8 border-3 border-primary-light rounded-full animate-spin border-t-primary"></div>
              <span className="text-text-secondary dark:text-text-secondary-dark">Loading articles...</span>
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
                    className="group bg-background dark:bg-background-dark rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 dark:border-gray-600 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="cursor-pointer">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={blog.image || "/placeholder.svg?height=200&width=400&query=blog article"}
                          alt={blog.title || blog.slug}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="bg-primary-light dark:bg-primary-light text-primary px-3 py-1 rounded-full text-sm font-medium">
                          {blog.category || "Article"}
                        </span>
                        {blog.readTime && (
                          <span className="text-text-secondary dark:text-text-secondary-dark text-sm">{blog.readTime} min read</span>
                        )}
                      </div>

                      <div className="group/title cursor-pointer">
                        <h2 className="text-xl font-semibold text-text dark:text-gray-200 group-hover/title:text-primary transition-colors duration-200 line-clamp-2 mb-3">
                          {blog.title || blog.slug}
                        </h2>
                      </div>

                      {blog.excerpt && (
                        <p className="text-text-secondary dark:text-text-secondary-dark text-sm line-clamp-3 mb-4">{blog.excerpt}</p>
                      )}

                      <div className="flex items-center justify-between">
                        {blog.publishedAt && (
                          <time className="text-text-secondary dark:text-text-secondary-dark text-sm">
                            {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </time>
                        )}

                        <button className="inline-flex items-center gap-1 text-primary hover:text-primary-hover text-sm font-medium transition-colors group/link">
                          Read more
                          <MdOutlineArrowOutward className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                        </button>
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
                    className="group bg-background dark:bg-background-dark rounded-2xl shadow-sm hover:shadow-lg border border-gray-200 dark:border-gray-600 overflow-hidden transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-80 flex-shrink-0 cursor-pointer">
                        <div className="relative h-48 md:h-full overflow-hidden">
                          <img
                            src={blog.image || "/placeholder.svg?height=200&width=320&query=blog article"}
                            alt={blog.title || blog.slug}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </div>

                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="bg-primary-light dark:bg-primary-light text-primary px-3 py-1 rounded-full text-sm font-medium">
                              {blog.category || "Article"}
                            </span>
                            {blog.readTime && (
                              <span className="text-text-secondary dark:text-text-secondary-dark text-sm">{blog.readTime} min read</span>
                            )}
                          </div>

                          <div className="group/title cursor-pointer">
                            <h2 className="text-2xl font-semibold text-text dark:text-text-dark group-hover/title:text-primary transition-colors duration-200 mb-3">
                              {blog.title || blog.slug}
                            </h2>
                          </div>

                          {blog.excerpt && (
                            <p className="text-text-secondary dark:text-text-secondary-dark line-clamp-2 mb-4">{blog.excerpt}</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          {blog.publishedAt && (
                            <time className="text-text-secondary dark:text-text-secondary-dark text-sm">
                              {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </time>
                          )}

                          <button className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-text-inverse px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            Read Article
                            <MdOutlineArrowOutward className="w-4 h-4" />
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
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-background-secondary dark:bg-background-dark rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200 dark:border-gray-600">
                <MdSearch className="w-10 h-10 text-text-secondary dark:text-text-secondary-dark" />
              </div>
              <h3 className="text-2xl font-semibold text-text dark:text-text-dark mb-3">
                {searchTerm ? "No articles found" : "No articles available"}
              </h3>
              <p className="text-text-secondary dark:text-text-secondary-dark mb-6">
                {searchTerm
                  ? `We couldn't find any articles matching "${searchTerm}". Try adjusting your search terms.`
                  : "We're working on bringing you fresh content. Check back soon!"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="bg-primary hover:bg-primary-hover text-text-inverse px-6 py-3 rounded-lg font-medium transition-colors"
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
                    ? "border-gray-200 dark:border-gray-600 text-text-secondary dark:text-text-secondary-dark cursor-not-allowed"
                    : "border-gray-200 dark:border-gray-600 text-text dark:text-text-dark hover:bg-background-secondary dark:hover:bg-background-dark"
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
                        ? "bg-primary text-text-inverse"
                        : "text-text dark:text-text-dark hover:bg-background-secondary dark:hover:bg-background-dark"
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
                    ? "border-gray-200 dark:border-gray-600 text-text-secondary dark:text-text-secondary-dark cursor-not-allowed"
                    : "border-gray-200 dark:border-gray-600 text-text dark:text-text-dark hover:bg-background-secondary dark:hover:bg-background-dark"
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