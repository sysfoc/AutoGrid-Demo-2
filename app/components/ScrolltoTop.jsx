"use client"
import { useState, useEffect } from "react"

const ScrolltoTop = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const scrollToTop = () => {
    setIsAnimating(true)

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }, 200)

    setTimeout(() => {
      setIsAnimating(false)
    }, 2500)
  }

  const toggleVisibility = () => {
    const scrolled = window.scrollY
    const maxHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = (scrolled / maxHeight) * 100

    setScrollProgress(progress)

    if (scrolled > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
      setIsAnimating(false) 
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility)
    return () => {
      window.removeEventListener("scroll", toggleVisibility)
    }
  }, [])

  const CarIcon = () => (
    <img
      src="/isolated.png"
      alt="Car top view"
      className={`w-24 h-32 object-contain relative z-10 transition-all duration-1000 ${
        isAnimating
          ? "transform -translate-y-96 scale-110 animate-bounce"
          : ""
      }`}
    />
  )

  return (
    <div>
      {isVisible && (
        <div
          className={`group fixed bottom-4 right-3 sm:right-4 md:right-6 cursor-pointer z-[9999] transition-all duration-500 hover:scale-105 ${
            isAnimating ? "transform -translate-y-32" : "hover:-translate-y-2"
          }`}
          onClick={scrollToTop}
        >
          <div className="relative">
            <div className="relative w-24 h-32 rounded-full transition-all duration-300 flex items-center justify-center overflow-visible">
              <CarIcon />

              {isAnimating && (
                <div className="absolute inset-0 flex flex-col justify-center items-center space-y-1 animate-pulse">
                  <div className="w-10 h-0.5 bg-gray-600/80 animate-pulse"></div>
                  <div className="w-8 h-0.5 bg-gray-500/60 animate-pulse delay-75"></div>
                  <div className="w-6 h-0.5 bg-gray-400/40 animate-pulse delay-150"></div>
                  <div className="w-4 h-0.5 bg-gray-300/20 animate-pulse delay-200"></div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default ScrolltoTop
