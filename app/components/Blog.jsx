"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, ChevronDown, ChevronUp, MessageCircle, Eye, Calendar } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

const Blog = () => {
  const t = useTranslations("HomePage")
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAll, setShowAll] = useState(false)

  const INITIAL_DISPLAY_COUNT = 3

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blog")
        if (!response.ok) throw new Error("Failed to fetch blogs")
        const data = await response.json()
        setBlogs(data.blogs)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch blogs")
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  const formatCount = (count) => {
    if (count === 0) return "0"
    if (count === 1) return "1"
    if (count < 1000) return count.toString()
    if (count < 1000000) return (count / 1000).toFixed(1) + "K"
    return (count / 1000000).toFixed(1) + "M"
  }

  const getUniqueViewsCount = (views) => {
    if (!views || !Array.isArray(views)) return 0
    return new Set(views.map((view) => view.ip)).size
  }

  if (error) {
    return (
      <section className="relative py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block rounded-2xl bg-red-50 border border-red-200 p-6 shadow-lg dark:bg-red-900/20 dark:border-red-800/30">
            <h3 className="mb-2 text-xl font-bold text-red-800 dark:text-red-200">Error Loading Blogs</h3>
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 bg-background dark:bg-background-dark">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-text dark:text-text-inverse mb-4 md:text-4xl">{t("blogHeading")}</h2>
          <Link href={"/blogs"} className="group inline-flex">
            <div className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 font-medium text-text-inverse shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-primary-hover">
              <span>{t("viewAll")}</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </div>
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="relative">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary dark:border-gray-700 dark:border-t-primary"></div>
              <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border-4 border-primary/30 opacity-20"></div>
            </div>
          </div>
        )}

        {!loading && blogs.length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(showAll ? blogs : blogs.slice(0, INITIAL_DISPLAY_COUNT)).map((blog) => (
                <Link href={`/blog/${blog.slug}`} key={blog.slug}>
                  <article className="group relative h-full overflow-hidden rounded-xl bg-background shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-2 dark:bg-background-dark border border-gray-200 dark:border-gray-700 flex flex-col">
                    {/* Image */}
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={blog.image || "/sydney.jpg"}
                        alt={blog.metaTitle || blog.h1 || "Blog post"}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="mb-4 flex-1">
                        <h3 className="text-lg font-bold line-clamp-2 text-text dark:text-text-inverse mb-3 leading-tight group-hover:text-primary transition-colors">
                          {blog.h1 || blog.metaTitle}
                        </h3>
                        {blog.metaDescription && (
                          <p className="text-text-secondary dark:text-text-inverse leading-relaxed text-sm line-clamp-2">
                            {blog.metaDescription}
                          </p>
                        )}
                      </div>

                      {/* Date */}
                      <div className="mb-4 flex items-center text-sm text-primary font-medium">
                        <Calendar className="mr-2 h-4 w-4" />
                        <time dateTime={blog.createdAt}>
                          {new Date(blog.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </time>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="flex space-x-4 text-sm">
                          <div className="flex items-center bg-primary-light dark:bg-primary-light/20 px-3 py-1 rounded-full">
                            <MessageCircle className="mr-1 h-4 w-4 text-primary dark:text-gray-100" />
                            <span className="font-semibold text-primary dark:text-gray-100">
                              {formatCount(blog.comments?.length || 0)}
                            </span>
                          </div>
                          <div className="flex items-center bg-background-secondary dark:bg-primary-light/20 px-3 py-1 rounded-full">
                            <Eye className="mr-1 h-4 w-4 text-text-secondary dark:text-gray-100" />
                            <span className="font-semibold text-text-secondary dark:text-gray-100">
                              {formatCount(getUniqueViewsCount(blog.views))}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center text-sm font-bold text-primary group-hover:text-primary-hover transition-colors">
                          Read more
                          <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {blogs.length > INITIAL_DISPLAY_COUNT && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 font-medium text-text-inverse shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-primary-hover"
                >
                  <span>{showAll ? "Show Less" : `Show More (${blogs.length - INITIAL_DISPLAY_COUNT})`}</span>
                  {showAll ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
            )}
          </div>
        )}

        {!loading && blogs.length === 0 && (
          <div className="py-8 text-center">
            <div className="mx-auto max-w-lg rounded-3xl bg-primary-light border border-gray-200 p-6 shadow-2xl dark:bg-primary-light/20 dark:border-gray-700">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-text-inverse shadow-lg">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 01-2-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-primary">No Blogs Available</h3>
              <p className="text-text-secondary leading-relaxed">
                We're preparing fresh content. Check back soon for updates!
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Blog