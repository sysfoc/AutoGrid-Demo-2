// app/contact/page.tsx or equivalent path

import { headers } from "next/headers"
import type { Metadata } from "next"
import ContactUs from "../components/Contact"

// Define the shape of the API response
type MetaPageData = {
  metaTitle: string | null
  metaDescription: string | null
}

async function getContactMetaData(baseUrl: string): Promise<MetaPageData | null> {
  const res = await fetch(`${baseUrl}/api/meta-pages?type=contact`, {
    cache: "no-store",
  })
  if (!res.ok) return null
  const result = await res.json()
  return result.data || null
}

// Dynamic metadata generation for the Contact page
export async function generateMetadata(): Promise<Metadata> {
  const headersList =await headers()
  const host = headersList.get("host")
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
  const url = `${protocol}://${host}`

  const data = await getContactMetaData(url)

  return {
    title: data?.metaTitle ?? "Contact Us - Auto Car Dealers",
    description:
      data?.metaDescription ??
      "Have questions or want to work with us? Fill out the form below, and we'll get back to you as soon as possible.",
  }
}

// This is your Server Component page
export default function ContactPage() {
  return (
    <>
      <ContactUs />
    </>
  )
}
