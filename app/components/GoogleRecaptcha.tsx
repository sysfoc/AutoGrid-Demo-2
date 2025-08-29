"use client"

import Script from "next/script"
import { useEffect, useState } from "react"

interface RecaptchaSettings {
  siteKey: string
  status: "active" | "inactive"
}

export default function GoogleRecaptcha() {
  const [recaptchaSettings, setRecaptchaSettings] = useState<RecaptchaSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRecaptchaSettings = async () => {
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

        if (data.settings?.recaptcha) {
          setRecaptchaSettings({
            siteKey: data.settings.recaptcha.siteKey,
            status: data.settings.recaptcha.status,
          })
        }
      } catch (error) {
        console.error("Failed to fetch reCAPTCHA settings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecaptchaSettings()
  }, [])

  // Don't render anything while loading or if reCAPTCHA is inactive or missing siteKey
  if (isLoading || !recaptchaSettings || recaptchaSettings.status !== "active" || !recaptchaSettings.siteKey) {
    return null
  }

  return (
    <Script
      strategy="afterInteractive"
      src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSettings.siteKey}`}
      async
      defer
    />
  )
}
