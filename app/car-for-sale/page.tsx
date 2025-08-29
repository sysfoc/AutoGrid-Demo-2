
import { headers } from "next/headers"
import type { Metadata } from "next"
import CarListingPageContent from "../components/CarListingPageContent"
type MetaPageData = {
  metaTitle: string | null
  metaDescription: string | null
}
async function getCarForSaleMetaData(baseUrl: string): Promise<MetaPageData | null> {
  const res = await fetch(`${baseUrl}/api/meta-pages?type=car-for-sale`, {
    cache: "no-store",
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
  const data = await getCarForSaleMetaData(siteUrl)

  return {
    title: data?.metaTitle ?? "Cars For Sale - Auto Car Dealers",
    description: data?.metaDescription ?? "Browse our extensive inventory of cars for sale.",
  }
}

export default function CarForSalePage() {
  return (
    <section className="mx-4 sm:mx-8">
      <CarListingPageContent />
    </section>
  )
}
