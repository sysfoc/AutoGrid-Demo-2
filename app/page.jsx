"use client"
import Herosection from "./components/Herosection"
import VehicalsList from "./components/VehicalsList"
import BrandsList from "./components/BrandsList"
import BrowseCars from "./components/BrowseCars"
import Blog from "./components/Blog"
import { useState, useEffect } from "react"
import MainLayout from "./components/MainLayout.jsx"
export default function Home() {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add("no-scrollbar")
    return () => {
      document.documentElement.classList.remove("no-scrollbar")
    }
  }, [])

  return (
    <div>
      <MainLayout>
        <Herosection />
      {/* <CarSearchHorizontal/> */}
      {/* <BrandsList /> */}
      </MainLayout>
      <VehicalsList loadingState={loading} />
      {/* <BrowseCars /> */}
      <Blog />
    </div>
  )
}
