// app/brands/page.tsx or similar location

import { headers } from "next/headers"
import type { Metadata } from "next"
import BrandsPageClient from "../components/Brands"

// Define expected metadata response shape
type MetaPageData = {
  metaTitle: string | null
  metaDescription: string | null
}

// Fetch metadata from your API
async function getBrandsMetaData(baseUrl: string): Promise<MetaPageData | null> {
  const res = await fetch(`${baseUrl}/api/meta-pages?type=brands`, {
    cache: "no-store", // Always fetch fresh data
  })
  if (!res.ok) return null
  const result = await res.json()
  return result.data || null
}

// Dynamic metadata generation
export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
  const siteUrl = `${protocol}://${host}`

  const data = await getBrandsMetaData(siteUrl)

  return {
    title: data?.metaTitle ?? "All Brands - Auto Car Dealers",
    description: data?.metaDescription ?? "Discover our complete collection of automotive brands.",
  }
}

// Server Component rendering client component
export default function BrandsServerPage() {
  return (
    <>
      <BrandsPageClient />
    </>
  )
}
