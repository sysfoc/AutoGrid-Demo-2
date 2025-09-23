"use client"

import Image from "next/image"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { useState } from "react"

const Slider = ({ loadingState, carData }) => {
  const loading = loadingState
  const [currentSlide, setCurrentSlide] = useState(0)

  const imageUrls = Array.isArray(carData?.imageUrls)
    ? carData.imageUrls
    : carData?.imageUrls && typeof carData.imageUrls === "object"
      ? Object.values(carData.imageUrls)
      : []

  const mediaItems = [
    carData?.video ? { type: "video", src: carData.video } : null,
    ...(Array.isArray(carData?.imageUrls)
      ? carData.imageUrls
      : carData?.imageUrls && typeof carData.imageUrls === "object"
        ? Object.values(carData.imageUrls)
        : []
    ).map((image) => ({
      type: "image",
      src: image,
    })),
  ].filter(Boolean)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % mediaItems.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + mediaItems.length) % mediaItems.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  if (!carData?.video && imageUrls.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-br from-purple-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-purple-600 dark:text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">No images available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Header with media count */}
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm">
          {mediaItems.length} {mediaItems.length === 1 ? "Media" : "Media Items"}
        </div>
      </div>

      {/* Quality badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-white/90 text-purple-600 px-3 py-1 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm">
          HD Quality
        </div>
      </div>

      {/* Main Carousel */}
      <div className="relative h-64 sm:h-80 xl:h-96 2xl:h-[28rem] rounded-2xl overflow-hidden shadow-inner">
        <div className="relative w-full h-full">
          {mediaItems.map((media, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              {loading ? (
                <div className="h-full w-full bg-gradient-to-br from-purple-100 to-emerald-100 dark:from-gray-700 dark:to-gray-600 animate-pulse flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-purple-200 dark:bg-purple-800 rounded-full animate-pulse"></div>
                    <Skeleton width={200} height={20} />
                  </div>
                </div>
              ) : media.type === "video" ? (
                <div className="relative h-full w-full group">
                  <video
                    src={media.src}
                    controls
                    className="h-full w-full object-cover"
                    poster="/placeholder-video.jpg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Video
                  </div>
                </div>
              ) : (
                <div className="relative h-full w-full group">
                  <Image
                    src={media.src || "/placeholder.svg"}
                    alt={`Vehicle Media ${index + 1}`}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {index + 1} / {mediaItems.length}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        {mediaItems.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            >
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            >
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dots Indicators */}
        {mediaItems.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {mediaItems.map((_, index) => (
              <button
                aria-label="Go to slide"
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentSlide
                    ? "bg-white w-8"
                    : "bg-white/60 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {mediaItems.length > 1 && (
        <div className="mt-4 px-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {mediaItems.map((media, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative flex-shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden transition-all duration-200 hover:scale-105 ${
                  currentSlide === index
                    ? "ring-2 ring-purple-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-800"
                    : "hover:ring-1 hover:ring-purple-300"
                }`}
              >
                {media.type === "video" ? (
                  <div className="relative w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <div className="absolute inset-0 bg-black/20"></div>
                  </div>
                ) : (
                  <Image
                    src={media.src || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    className="object-cover"
                    fill
                    sizes="80px"
                  />
                )}
                {currentSlide === index && (
                  <div className="absolute inset-0 bg-purple-500/20 border-2 border-purple-500 rounded-lg"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Slider