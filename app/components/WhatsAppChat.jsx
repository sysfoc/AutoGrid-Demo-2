"use client"
import { MessageCircle } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppChat = () => {
  const phoneNumber = "923006904440"

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}`
    window.open(whatsappUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <button
      onClick={handleWhatsAppClick}
      className="group fixed bottom-20 right-3 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-30 hover:scale-105"
      // bottom-4 right-20
      type="button"
      aria-label="Open WhatsApp Chat"
    >
      {/* <MessageCircle className="w-6 h-6" /> */}
      <FaWhatsapp className="w-8 h-8" />

      <div className="absolute right-20 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 group-hover:translate-x-0 translate-x-4">
        <div className="bg-gray-900/90 backdrop-blur-md text-white px-4 py-2 rounded-lg shadow-lg border border-gray-700/50 whitespace-nowrap">
          <span className="text-sm font-medium">Chat on WhatsApp</span>
          <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2">
            <div className="w-0 h-0 border-l-4 border-l-gray-900/90 border-y-4 border-y-transparent"></div>
          </div>
        </div>
      </div>
    </button>
  )
}

export default WhatsAppChat
