import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { ThemeModeScript } from "flowbite-react"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./globals.css"
import LayoutRenderer from "./components/LayoutRenderer"
import Cookiebox from "./components/Cookiebox"
import GoogleAnalytics from "./components/GoogleAnalytics"
import GoogleRecaptcha from "./components/GoogleRecaptcha"
import { CurrencyProvider } from "./context/CurrencyContext"
import { AuthProvider } from "./context/UserContext"
import { SidebarProvider } from "./context/SidebarContext"
import { DistanceProvider } from "./context/DistanceContext"
import { Suspense } from "react"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap", // ✅ prevents CLS on font load
})

const getGeneralSettings = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
      ? `${process.env.NEXT_PUBLIC_BASE_URL}`
      : "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/settings/general`, {
      next: { revalidate: 0 },
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

const getHomepageSettings = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
      ? `${process.env.NEXT_PUBLIC_BASE_URL}`
      : "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/homepage`, {
      next: { revalidate: 0 },
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const homepageData = await getHomepageSettings()
  return {
    title: homepageData?.seoTitle || "Auto Car Dealers",
    description:
      homepageData?.seoDescription ||
      "Make Deals Of Cars And Any Other Vehical",
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()
  const settingsData = await getGeneralSettings()

  const settings = settingsData?.settings || {}

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* ✅ Preload font to prevent layout shift */}
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfedw.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* ✅ Immediately apply dark/light from localStorage */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem("theme");
                  if (theme === "dark") {
                    document.documentElement.classList.add("dark");
                  } else {
                    document.documentElement.classList.remove("dark");
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${poppins.className} bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-200`}>
        <SidebarProvider>
          <ThemeModeScript /> {/* still included for Flowbite theme toggling */}
          <GoogleAnalytics />
          <GoogleRecaptcha />
          <NextIntlClientProvider messages={messages}>
            <AuthProvider>
              <LayoutRenderer>
                <Suspense
                  fallback={
                    <div className="h-16 w-full animate-pulse bg-gray-200 dark:bg-gray-700" />
                  }
                >
                  <NuqsAdapter>
                    <CurrencyProvider>
                      <DistanceProvider>{children}</DistanceProvider>
                      <Cookiebox cookieConsent={settings.cookieConsent} />
                    </CurrencyProvider>
                  </NuqsAdapter>
                </Suspense>
              </LayoutRenderer>
            </AuthProvider>
          </NextIntlClientProvider>
          <ToastContainer autoClose={3000} />
        </SidebarProvider>
      </body>
    </html>
  )
}
