// contexts/SidebarContext.js
"use client"

import { createContext, useContext, useState, useEffect } from 'react'

const SidebarContext = createContext()

export function SidebarProvider({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const openSidebar = () => setIsSidebarOpen(true)
  const closeSidebar = () => setIsSidebarOpen(false)
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isSidebarOpen])

  return (
    <SidebarContext.Provider 
      value={{ 
        isSidebarOpen, 
        setIsSidebarOpen,
        openSidebar, 
        closeSidebar, 
        toggleSidebar 
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}