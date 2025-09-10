"use client"
import Herosection from "./components/Herosection"
import VehicalsList from "./components/VehicalsList"
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
      </MainLayout>
      <VehicalsList loadingState={loading} />
      <Blog />
    </div>
  )
}
