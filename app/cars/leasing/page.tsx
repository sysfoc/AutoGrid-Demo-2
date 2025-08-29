import { headers } from "next/headers"
import type { Metadata } from "next"
import { useTranslations } from "next-intl";
import LeaseCarListingPageContent from "../../components/LeaseCarListingPageContent" 

type MetaPageData = {
  metaTitle: string | null
  metaDescription: string | null
}

async function getLeasingMetaData(baseUrl: string): Promise<MetaPageData | null> {
  const res = await fetch(`${baseUrl}/api/meta-pages?type=leasing`, {
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

  const data = await getLeasingMetaData(siteUrl)

  return {
    title: data?.metaTitle ?? "Car Leasing Deals - Auto Car Dealers",
    description: data?.metaDescription ?? "Explore the best car leasing offers and find your next vehicle.",
  }
}

export default function Home() {
  const t = useTranslations("carLeasing");
  return (
     <section className="mx-4 sm:mx-8">
      <LeaseCarListingPageContent />
    </section>
  )
}
