"use client"
import Script from "next/script"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { pageview } from "../lib/gtagHelper"

interface AnalyticsSettings {
  trackingId: string
  status: "active" | "inactive"
}

export default function GoogleAnalytics({
  GA_MEASUREMENT_ID,
}: {
  GA_MEASUREMENT_ID?: string
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [analyticsSettings, setAnalyticsSettings] = useState<AnalyticsSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch analytics settings from API
  useEffect(() => {
    const fetchAnalyticsSettings = async () => {
      try {
        const response = await fetch("/api/settings/general", {
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.settings?.analytics) {
          setAnalyticsSettings({
            trackingId: data.settings.analytics.trackingId,
            status: data.settings.analytics.status,
          })
        } else {
          // Fallback to prop if API doesn't have settings
          if (GA_MEASUREMENT_ID) {
            setAnalyticsSettings({
              trackingId: GA_MEASUREMENT_ID,
              status: "active",
            })
          }
        }
      } catch (error) {
        console.error("Failed to fetch analytics settings:", error)
        // Fallback to prop on error
        if (GA_MEASUREMENT_ID) {
          setAnalyticsSettings({
            trackingId: GA_MEASUREMENT_ID,
            status: "active",
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalyticsSettings()
  }, [GA_MEASUREMENT_ID])

  // Handle page navigation tracking
  useEffect(() => {
    if (!analyticsSettings?.trackingId || typeof window.gtag === "undefined") return

    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")
    pageview(analyticsSettings.trackingId, url)
  }, [pathname, searchParams, analyticsSettings?.trackingId])

  // Don't render anything while loading or if analytics is inactive
  if (isLoading || !analyticsSettings || analyticsSettings.status !== "active" || !analyticsSettings.trackingId) {
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${analyticsSettings.trackingId}`}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          
          // Safe localStorage access with error handling
          let cookieConsent = null;
          
          try {
            if (typeof localStorage !== 'undefined') {
              // Get cookie consent preference
              cookieConsent = localStorage.getItem('cookie_consent');
            }
          } catch (error) {
            console.error('LocalStorage access error:', error);
          }
          
          // Validate consent value
          const validConsent = cookieConsent === 'all' ? 'granted' : 'denied';
          
          // Initialize Google Analytics with consent defaults
          gtag('consent', 'default', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied'
          });
          
          gtag('config', '${analyticsSettings.trackingId}', {
            page_path: window.location.pathname,
            anonymize_ip: true,
            debug_mode: ${process.env.NODE_ENV !== "production"}
          });
          
          // Update consent if user has already made a choice
          if (cookieConsent && validConsent === 'granted') {
            gtag('consent', 'update', {
              'analytics_storage': 'granted',
              'ad_storage': 'granted'
            });
          }
          
        `}
      </Script>
    </>
  )
}
