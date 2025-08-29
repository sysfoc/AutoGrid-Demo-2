import connectDB from "../lib/mongodb";
import VehicleFinanceCalculator from "./Financing"
import { headers } from "next/headers"
import type { Metadata } from "next"

type MetaPageData = {
  metaTitle: string | null
  metaDescription: string | null
}

async function getCarFinancingMetaData(baseUrl: string): Promise<MetaPageData | null> {
  const res = await fetch(`${baseUrl}/api/meta-pages?type=car-financing`, {
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

  const data = await getCarFinancingMetaData(siteUrl)

  return {
    title: data?.metaTitle ?? "Car Financing - Get Your Dream Car Today",
    description: data?.metaDescription ?? "Explore flexible car financing options with competitive rates. Get pre-approved for auto loans, calculate payments, and drive your dream car today. Apply now for instant approval.",
  }
}

export default function CarFinancingServerPage() {
  return (
    <>
      <VehicleFinanceCalculator />
    </>
  )
}