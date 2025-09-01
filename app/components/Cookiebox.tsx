"use client"
import { getLocalStorage, setLocalStorage } from "../lib/storageHelper"
import { useState, useEffect } from "react"

interface CookieboxProps {
  cookieConsent?: {
    message: string
    buttonText: string
    textColor: string
    bgColor: string
    buttonTextColor: string
    buttonBgColor: string
    status: "active" | "inactive"
  }
}

const isValidCookieConsent = (obj: any): obj is NonNullable<CookieboxProps["cookieConsent"]> => {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.message === "string" &&
    typeof obj.buttonText === "string" &&
    typeof obj.textColor === "string" &&
    typeof obj.bgColor === "string" &&
    typeof obj.buttonTextColor === "string" &&
    typeof obj.buttonBgColor === "string" &&
    (obj.status === "active" || obj.status === "inactive")
  )
}

// Validate hex color format
const isValidHexColor = (color: string): boolean => {
  return /^#[0-9A-Fa-f]{6}$/.test(color)
}

// Sanitize and validate cookie consent settings
const sanitizeCookieConsent = (
  settings: CookieboxProps["cookieConsent"],
): NonNullable<CookieboxProps["cookieConsent"]> => {
  const defaultSettings = {
    message: "We Use Cookies",
    buttonText: "Accept All",
    textColor: "#000000",
    bgColor: "#ffffff",
    buttonTextColor: "#ffffff",
    buttonBgColor: "#000000",
    status: "active" as const,
  }

  // Handle undefined or null settings
  if (!settings || !isValidCookieConsent(settings)) {
    return defaultSettings
  }

  const sanitized = {
    message: settings.message?.trim() || defaultSettings.message,
    buttonText: settings.buttonText?.trim() || defaultSettings.buttonText,
    textColor: isValidHexColor(settings.textColor) ? settings.textColor : defaultSettings.textColor,
    bgColor: isValidHexColor(settings.bgColor) ? settings.bgColor : defaultSettings.bgColor,
    buttonTextColor: isValidHexColor(settings.buttonTextColor)
      ? settings.buttonTextColor
      : defaultSettings.buttonTextColor,
    buttonBgColor: isValidHexColor(settings.buttonBgColor) ? settings.buttonBgColor : defaultSettings.buttonBgColor,
    status: settings.status || defaultSettings.status,
  }

  return sanitized
}

const Cookiebox = ({ cookieConsent: propsCookieConsent }: CookieboxProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [cookieConsent, setCookieConsent] = useState<NonNullable<CookieboxProps["cookieConsent"]> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const fetchSettings = async (attempt = 0) => {
    const maxRetries = 3
    const retryDelay = 1000 * Math.pow(2, attempt) // Exponential backoff

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      const response = await fetch("/api/settings/general", {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      })
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (!data || typeof data !== "object") {
        throw new Error("Invalid response format")
      }

      if (data.error) {
        throw new Error(`API Error: ${data.error}`)
      }

      let finalSettings: NonNullable<CookieboxProps["cookieConsent"]>
      if (data.settings && data.settings.cookieConsent) {
        finalSettings = sanitizeCookieConsent(data.settings.cookieConsent)
      } else {
        finalSettings = sanitizeCookieConsent(propsCookieConsent)
      }

      setCookieConsent(finalSettings)
      setFetchError(null)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setFetchError(errorMessage)

      if (attempt < maxRetries) {
        setRetryCount(attempt + 1)

        setTimeout(() => {
          fetchSettings(attempt + 1)
        }, retryDelay)
      } else {
        console.error("Max retries reached, using fallback settings")
        const fallbackSettings = sanitizeCookieConsent(propsCookieConsent)
        setCookieConsent(fallbackSettings)
      }
    } finally {
      if (attempt === 0 || attempt >= maxRetries) {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    // Validate environment
    if (typeof window === "undefined") {
      console.error("Cookiebox: Window object not available")
      setIsLoading(false)
      return
    }

    // Check if required storage helper functions exist
    if (typeof getLocalStorage !== "function" || typeof setLocalStorage !== "function") {
      console.error("Cookiebox: Storage helper functions not available")
      setIsLoading(false)
      return
    }

    fetchSettings()
  }, [propsCookieConsent])

  useEffect(() => {
    if (!isLoading && cookieConsent) {
      const stored = getLocalStorage("cookie_consent", null)
      const isValidStoredConsent = stored === "essential" || stored === "all"

      // Always show if no consent exists AND consent is active
      if (!isValidStoredConsent && cookieConsent.status === "active") {
        setIsVisible(true)
      } else if (isValidStoredConsent) {
        setIsVisible(false)
      } else if (cookieConsent.status === "inactive") {
        setIsVisible(false)
      }
    }
  }, [isLoading, cookieConsent?.status, cookieConsent]) // Add cookieConsent as dependency

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = getLocalStorage("cookie_consent", null)
      if (!stored && cookieConsent?.status === "active") {
        setIsVisible(true)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [cookieConsent])

  const handleConsent = (value: "essential" | "all") => {
    try {

      // Validate consent value
      if (value !== "essential" && value !== "all") {
        console.error("Invalid consent value provided")
        return
      }

      // Store consent preference
      setLocalStorage("cookie_consent", value)

      // Handle Google Analytics consent
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        const analyticsValue = value === "all" ? "granted" : "denied"

        window.gtag("consent", "update", {
          analytics_storage: analyticsValue,
          ad_storage: analyticsValue,
        })
      }

      setIsVisible(false)

      try {
        window.location.reload()
      } catch (reloadError) {
        console.error("Error reloading page:", reloadError)
      }
    } catch (error) {
      console.error("Error handling consent:", error)
    }
  }

  // Early returns for various states
  if (typeof window === "undefined") {
    return null
  }

  if (isLoading) {
    return null
  }

  if (fetchError && retryCount >= 3) {
    console.error("Failed to load cookie settings after multiple attempts:", fetchError)
    // Continue with fallback settings rather than showing error to user
  }

  if (!isVisible || !cookieConsent || cookieConsent.status === "inactive") {
    return null
  }

  return (
    <section className="cookiebox-container">
      <div className="cookiebox-content">
        <h2 className="cookiebox-title">{cookieConsent.message || "We Use Cookies"}</h2>
        <p className="cookiebox-description">
          We use cookies to enhance your experience. You can choose which ones to allow.
        </p>
        <div className="cookiebox-buttons">
          <button
            type="button"
            onClick={() => handleConsent("essential")}
            className="cookiebox-button"
          >
            Reject All
          </button>
          <button
            type="button"
            onClick={() => handleConsent("all")}
            className="cookiebox-button"
          >
            {cookieConsent.buttonText || "Accept All"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .cookiebox-container {
          position: fixed;
          z-index: 150;
          display: flex;
          
          /* Mobile first - xs screens (< 475px) - centered with margins */
          bottom: 0.75rem;
          left: 0.75rem;
          right: 0.75rem;
          max-width: 320px;
          margin: 0 auto;
          border-radius: 0.75rem;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15), 0 3px 10px rgba(0, 0, 0, 0.1);
        }
        
        /* sm screens (≥ 475px) */
        @media (min-width: 475px) {
          .cookiebox-container {
            bottom: 0.75rem;
            left: 1rem;
            right: 1rem;
            max-width: 340px;
            border-radius: 0.875rem;
          }
        }
        
        /* md screens (≥ 768px) */
        @media (min-width: 768px) {
          .cookiebox-container {
            bottom: 1rem;
            left: auto;
            right: 1rem;
            max-width: 350px;
          }
        }

        .cookiebox-content {
          width: 100%;
          background-color: ${cookieConsent.bgColor};
          color: ${cookieConsent.textColor};
          
          /* Mobile first - xs screens - compact padding */
          padding: 1rem;
          border-radius: 0.75rem;
        }
        
        /* sm screens */
        @media (min-width: 475px) {
          .cookiebox-content {
            padding: 1.125rem;
            border-radius: 0.875rem;
          }
        }
        
        /* md screens */
        @media (min-width: 768px) {
          .cookiebox-content {
            padding: 1.25rem;
          }
        }

        .cookiebox-title {
          font-weight: 600;
          line-height: 1.3;
          margin: 0;
          
          /* Mobile first - xs screens */
          font-size: 1rem;
        }
        
        /* sm screens */
        @media (min-width: 475px) {
          .cookiebox-title {
            font-size: 1.05rem;
          }
        }
        
        /* md screens */
        @media (min-width: 768px) {
          .cookiebox-title {
            font-size: 1.1rem;
          }
        }

        .cookiebox-description {
          opacity: 0.8;
          margin: 0;
          line-height: 1.4;
          
          /* Mobile first - xs screens */
          margin-top: 0.5rem;
          font-size: 0.85rem;
        }
        
        /* sm screens */
        @media (min-width: 475px) {
          .cookiebox-description {
            margin-top: 0.625rem;
            font-size: 0.875rem;
          }
        }
        
        /* md screens */
        @media (min-width: 768px) {
          .cookiebox-description {
            font-size: 0.875rem;
          }
        }

        .cookiebox-buttons {
          display: flex;
          
          /* Mobile first - xs screens */
          margin-top: 1rem;
          gap: 0.75rem;
        }
        
        /* sm screens */
        @media (min-width: 475px) {
          .cookiebox-buttons {
            margin-top: 1.125rem;
            gap: 0.875rem;
          }
        }

        .cookiebox-button {
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          background-color: ${cookieConsent.buttonBgColor};
          color: ${cookieConsent.buttonTextColor};
          font-weight: 500;
          flex: 1;
          
          /* Mobile first - xs screens */
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.85rem;
        }
        
        /* sm screens */
        @media (min-width: 475px) {
          .cookiebox-button {
            padding: 0.8125rem 1.125rem;
            font-size: 0.875rem;
            border-radius: 0.5625rem;
          }
        }
        
        /* md screens */
        @media (min-width: 768px) {
          .cookiebox-button {
            padding: 0.7rem 1rem;
            font-size: 0.875rem;
          }
        }

        .cookiebox-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        
        .cookiebox-button:active {
          transform: translateY(0);
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </section>
  )
}
export default Cookiebox