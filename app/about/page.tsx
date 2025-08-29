import { headers } from "next/headers"
import type { Metadata, ResolvingMetadata } from "next"

interface PageData {
  name: string
  content: string
  metaTitle?: string
  metaDescription?: string
}

async function getAboutContent(baseUrl: string): Promise<PageData | null> {
  const res = await fetch(`${baseUrl}/api/page-content/about`, {
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

  const data = await getAboutContent(baseUrl)

  return {
    title: data?.metaTitle || "About Us - Auto Car Dealers",
    description:
      data?.metaDescription ||
      "Welcome to Car Dealers! We are a team of innovators, creators, and problem-solvers committed to crafting meaningful digital experiences.",
  }
}

const AboutPage = async () => {
  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
  const baseUrl = `${protocol}://${host}`
  const data = await getAboutContent(baseUrl)

  return (
    <div className="min-h-screen bg-gray-50 py-10 mt-28 md:mt-32 dark:bg-gray-800">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-md dark:bg-gray-700">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800 dark:text-white">
          {data?.name || "About Us"}
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

export default AboutPage