"use client"

import Herosection from "./components/Herosection"
import VehicalsList from "./components/VehicalsList"
import Blog from "./components/Blog"
import { useState } from "react"
import MainLayout from "./components/MainLayout.jsx"

export default function Home() {
  const [loading, setLoading] = useState(false)

  return (
    <div>
      <MainLayout>
        <div className="min-h-[500px]">
          <Herosection />
        </div>
      </MainLayout>

      <div className="min-h-[500px]">
        <VehicalsList loadingState={loading} />
      </div>

      <div className="min-h-[500px]">
        <Blog />
      </div>
    </div>
  )
}
