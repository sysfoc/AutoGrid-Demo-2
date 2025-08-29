// app/blog/page.tsx or similar path

import { headers } from "next/headers"
import type { Metadata } from "next"
import AllBlogs from "../components/AllBlogs"

// Define the shape of the expected meta data response
type MetaPageData = {
  metaTitle: string | null
  metaDescription: string | null
}

// Fetch blog page metadata from your backend
async function getBlogMetaData(baseUrl: string): Promise<MetaPageData | null> {
  const res = await fetch(`${baseUrl}/api/meta-pages?type=blog`, {
    cache: "no-store", // Ensures fresh metadata
  })
  if (!res.ok) return null
  const result = await res.json()
  return result.data || null
}

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
  const siteUrl = `${protocol}://${host}`

  const data = await getBlogMetaData(siteUrl)

  return {
    title: data?.metaTitle ?? "Our Blog - Auto Car Dealers",
    description: data?.metaDescription ?? "Discover insights, tutorials, and stories from our team.",
  }
}

// Server Component rendering the AllBlogs client component
export default function BlogServerPage() {
  return (
    <>
      <AllBlogs />
    </>
  )
}
