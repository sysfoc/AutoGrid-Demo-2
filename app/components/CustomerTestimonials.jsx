"use client";
import React from "react";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const CustomerTestimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "Austin, TX",
      rating: 5,
      quote: "Exceptional service from start to finish. The team was professional, transparent, and helped me find the perfect car within my budget. Highly recommended!",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face&facepad=2",
      purchaseDate: "March 2024",
      verified: true
    },
    {
      id: 2,
      name: "Michael Chen",
      location: "Seattle, WA",
      rating: 5,
      quote: "Best car buying experience I have ever had. No pressure, honest pricing, and excellent financing options. My new SUV runs perfectly!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&facepad=2",
      purchaseDate: "January 2024",
      verified: true
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      location: "Miami, FL",
      rating: 5,
      quote: "Outstanding customer service and quality vehicles. The maintenance team keeps my car running like new. Worth every penny!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&facepad=2",
      purchaseDate: "February 2024",
      verified: true
    },
    {
      id: 4,
      name: "David Thompson",
      location: "Chicago, IL",
      rating: 5,
      quote: "Professional, reliable, and trustworthy. They delivered exactly what they promised. Great selection and competitive prices.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&facepad=2",
      purchaseDate: "April 2024",
      verified: true
    },
    {
      id: 5,
      name: "Lisa Park",
      location: "Denver, CO",
      rating: 5,
      quote: "Smooth transaction, excellent communication, and fantastic after-sales support. They truly care about their customers.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face&facepad=2",
      purchaseDate: "March 2024",
      verified: true
    },
    {
      id: 6,
      name: "Robert Wilson",
      location: "Phoenix, AZ",
      rating: 5,
      quote: "Incredible value and service quality. The team went above and beyond to ensure I was completely satisfied with my purchase.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&facepad=2",
      purchaseDate: "February 2024",
      verified: true
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full text-sm font-medium mb-3">
            <MdVerified className="w-4 h-4" />
            <span>Verified Reviews</span>
          </div>
          
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Customer Testimonials
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Do not just take our word for it. Here is what our satisfied customers have to say about their experience.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-gray-900/20 transition-shadow duration-300"
            >
              {/* Quote Icon */}
              <div className="flex justify-between items-start mb-3">
                <FaQuoteLeft className="w-4 h-4 text-blue-600 dark:text-blue-400 opacity-60" />
                {testimonial.verified && (
                  <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full text-xs font-medium">
                    <MdVerified className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {renderStars(testimonial.rating)}
              </div>

              {/* Quote */}
              <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-sm">
                {testimonial.quote}
              </blockquote>

              {/* Customer Info */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    {testimonial.location} • {testimonial.purchaseDate}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">4.9/5</div>
              <div className="flex items-center gap-1 mb-1">
                {renderStars(5)}
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Average Rating</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">2,500+</div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Happy Customers</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">98%</div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;