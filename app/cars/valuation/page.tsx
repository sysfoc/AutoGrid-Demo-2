
import { headers } from "next/headers"
import Valuation from "../../components/Valuation"
import type { Metadata } from "next"

type MetaPageData = {
  metaTitle: string | null
  metaDescription: string | null
}

async function getCarValuationMetaData(baseUrl: string): Promise<MetaPageData | null> {
  const res = await fetch(`${baseUrl}/api/meta-pages?type=car-valuation`, {
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

  const data = await getCarValuationMetaData(siteUrl)

  return {
    title: data?.metaTitle ?? "Get Your Car's True Value - Auto Car Dealers",
    description: data?.metaDescription ?? "Professional car valuation in minutes.",
  }
}

export default function CarValuationPage() {
  return (
    <>
      <Valuation />
    </>
  )
}
