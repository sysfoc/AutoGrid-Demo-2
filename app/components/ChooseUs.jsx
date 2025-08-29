"use client";
import React from "react";
import { BiSolidOffer } from "react-icons/bi";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { IoPricetagsOutline } from "react-icons/io5";
import { MdCleaningServices } from "react-icons/md";
import Link from "next/link";

const ChooseUs = () => {
  const features = [
     {
      icon: BiSolidOffer,
      title: "Special Lease Offers",
      description: "Explore flexible lease options tailored to your needs, making it easy and affordable to drive your next car.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      hoverBgColor: "group-hover:bg-blue-500/20"
    },
    {
      icon: VscWorkspaceTrusted,
      title: "Trusted Car Dealership",
      description: "Years of experience and thousands of satisfied customers make us your most reliable automotive partner.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      hoverBgColor: "group-hover:bg-green-500/20"
    },
    {
      icon: IoPricetagsOutline,
      title: "Transparent Pricing",
      description: "No hidden fees, no surprises. We believe in honest, upfront pricing that you can trust and understand.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      hoverBgColor: "group-hover:bg-purple-500/20"
    },
    {
      icon: MdCleaningServices,
      title: "Expert Car Service",
      description: "Professional maintenance and repair services to keep your vehicle running smoothly for years to come.",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      hoverBgColor: "group-hover:bg-orange-500/20"
    }
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.03%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] dark:bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.05%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-60 h-60 bg-blue-500/20 dark:bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/20 dark:bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative px-4 py-8 sm:px-6 md:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 space-y-3">
            <div className="inline-block">
              <div className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 rounded-full px-5 py-2 mb-2">
                <span className="text-blue-200 dark:text-blue-300 text-sm font-semibold tracking-wider uppercase">
                  Our Advantages
                </span>
              </div>
            </div>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white dark:text-gray-100 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 dark:from-gray-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                Why Choose Us?
              </span>
            </h2>
            
            <p className="text-base text-blue-100/80 dark:text-gray-300/90 max-w-2xl mx-auto leading-relaxed">
              Experience the difference with our premium automotive services and customer-first approach
            </p>
            
            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-500 dark:to-purple-500 mx-auto rounded-full"></div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative backdrop-blur-md bg-white/10 dark:bg-gray-800/30 hover:bg-white/15 dark:hover:bg-gray-800/50 border border-white/20 dark:border-gray-700/50 hover:border-white/30 dark:hover:border-gray-600/70 rounded-xl p-5 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 dark:hover:shadow-blue-400/20"
              >
                {/* Background glow effect */}
                <div className={`absolute inset-0 ${feature.bgColor} ${feature.hoverBgColor} dark:opacity-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Content */}
                <div className="relative z-10 space-y-3">
                  {/* Icon container */}
                  <div className="relative">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    {/* Floating particles effect */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-white/30 dark:bg-gray-200/40 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
                  </div>

                  {/* Text content */}
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white dark:text-gray-100 group-hover:text-blue-100 dark:group-hover:text-blue-200 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-blue-100/70 dark:text-gray-200 group-hover:text-blue-100/90 dark:group-hover:text-gray-200/90 leading-relaxed text-sm transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover indicator */}
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className={`w-5 h-0.5 bg-gradient-to-r ${feature.color} rounded-full`}></div>
                    <span className="text-xs text-blue-200 dark:text-blue-300 font-medium">Learn More</span>
                  </div>
                </div>

                {/* Border glow effect */}
                <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${feature.color} p-[1px]`}>
                  <div className="w-full h-full rounded-xl bg-slate-900 dark:bg-gray-950"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA Section */}
          <div className="mt-12 text-center">
            <div className="backdrop-blur-md bg-white/10 dark:bg-gray-800/30 border border-white/20 dark:border-gray-700/50 rounded-xl p-5 max-w-3xl mx-auto">
              <h3 className="text-xl md:text-2xl font-bold text-white dark:text-gray-100 mb-2">
                Ready to Experience the Difference?
              </h3>
              <p className="text-blue-100/80 dark:text-gray-300/90 mb-5 text-base">
                Join thousands of satisfied customers who chose excellence
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Link
                href="/car-for-sale"
                >
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 dark:from-blue-600 dark:to-purple-700 dark:hover:from-blue-700 dark:hover:to-purple-800 text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-sm">
                  Browse Our Inventory
                </button>
                </Link>
                <Link
                href="/contact"
                >
                <button 
                className="bg-white/20 dark:bg-gray-700/50 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-gray-600/60 text-white dark:text-gray-100 font-semibold px-6 py-2.5 rounded-lg border border-white/30 dark:border-gray-600/50 hover:border-white/50 dark:hover:border-gray-500/70 transition-all duration-300 text-sm">
                  Contact Us Today
                </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-8 fill-white dark:fill-gray-900">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default ChooseUs;