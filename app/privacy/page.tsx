import { headers } from "next/headers"
import type { Metadata, ResolvingMetadata } from "next"

interface PageData {
  name: string
  content: string
  metaTitle?: string
  metaDescription?: string
}

async function getPrivacyContent(baseUrl: string): Promise<PageData | null> {
  const res = await fetch(`${baseUrl}/api/page-content/privacy`, {
    cache: "no-store",
  })
  if (!res.ok) return null
  return res.json()
}

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
  const baseUrl = `${protocol}://${host}`

  const data = await getPrivacyContent(baseUrl)

  return {
    title: data?.metaTitle || "Privacy Policy - Auto Car Dealers",
    description:
      data?.metaDescription ||
      "This Privacy Policy outlines how we collect, use, and protect your personal information when you use our services.",
  }
}

const PrivacyPage = async () => {
  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
  const baseUrl = `${protocol}://${host}`
  const data = await getPrivacyContent(baseUrl)

  return (
    <div className="min-h-screen bg-gray-50 py-10 md:mt-32 mt-28 dark:bg-gray-800">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-md dark:bg-gray-700">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800 dark:text-white">
          {data?.name || "Privacy Policy"}
        </h1>
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{
            __html: data?.content || "<p>Loading...</p>",
          }}
        />
        <div className="mt-8 border-t pt-4">
          <p className="text-center text-sm text-gray-500 dark:text-white">
            &copy; {new Date().getFullYear()} AutomotiveWebSolutions by Sysfoc. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPage

