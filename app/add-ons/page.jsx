"use client";
import { 
  Search, 
  Shield, 
  TrendingUp, 
  Users, 
  Calculator, 
  Car, 
  Star, 
  Wrench,
  Globe,
  MessageSquare,
  FileText,
  Eye
} from "lucide-react";
import { useState } from "react";

export default function WebFeatures() {
  const [showAll, setShowAll] = useState(false);
  const features = [
    {
      icon: Search,
      title: "Advanced Search",
      description: "Powerful search functionality with budget filtering and keyword matching"
    },
    {
      icon: Shield,
      title: "SSL Security",
      description: "Industry-standard SSL encryption for secure browsing and transactions"
    },
    {
      icon: TrendingUp,
      title: "SEO Optimized",
      description: "Google SEO best practices with schema.org tagging for better visibility"
    },
    {
      icon: Calculator,
      title: "Finance Calculator",
      description: "Built-in repayment calculator with finance application integration"
    },
    {
      icon: Car,
      title: "Vehicle Management",
      description: "Complete inventory system with 360° spins and detailed vehicle pages"
    },
    {
      icon: Star,
      title: "Reviews & Ratings",
      description: "Customer reviews and ANCAP safety ratings for transparency"
    },
    {
      icon: Wrench,
      title: "Service Booking",
      description: "Integrated service booking system for seamless customer experience"
    },
    {
      icon: Globe,
      title: "Lead Management",
      description: "Automated lead allocation and tracking for better conversion"
    },
    {
      icon: MessageSquare,
      title: "Customer Support",
      description: "Australia-based helpdesk with specialist support team"
    },
    {
      icon: FileText,
      title: "Blog System",
      description: "Built-in content management for engaging customer content"
    },
    {
      icon: Eye,
      title: "Analytics Tracking",
      description: "Google Event tagging and AdWords integration for performance insights"
    },
    {
      icon: Users,
      title: "Brand Compliance",
      description: "Ongoing OEM compliance with manufacturer specifications"
    }
  ];

  return (
    <section className="py-8 mt-8 md:mt-12 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Our Website Includes
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
           All Radius sites are fast, feature-rich, and easy to manage—handle updates yourself or count on our expert support.
            </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {features.slice(0, showAll ? features.length : 8).map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/30 transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 group"
              >
                <div className="flex items-center justify-center w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-lg mb-3 group-hover:from-blue-600 group-hover:to-blue-700 dark:group-hover:from-blue-500 dark:group-hover:to-blue-600 transition-all duration-300">
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-10">
          <button 
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl dark:shadow-blue-900/20 dark:hover:shadow-blue-900/30 transform hover:-translate-y-0.5"
          >
            {showAll ? 'Show Less' : 'Load More'}
            <svg className={`w-5 h-5 ml-2 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}