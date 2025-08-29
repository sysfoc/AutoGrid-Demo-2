"use client";
import { useState, useEffect } from "react";
import { ArrowUpRight, Car, Handshake, Wrench, Calculator } from 'lucide-react';

const Services = () => {
  const [chooseUsData, setChooseUsData] = useState(null);

  useEffect(() => {
    const fetchChooseUsData = async () => {
      try {
        const response = await fetch("/api/homepage");
        const result = await response.json();
        if (response.ok) {
          setChooseUsData(result?.chooseUs);
        }
      } catch (error) {
        console.error("Error fetching choose us data:", error);
      }
    };

    fetchChooseUsData();
  }, []);
  
  const services = [
    {
      icon: Car,
      title: chooseUsData?.first?.heading,
      description: chooseUsData?.first?.description,
      buttonText: chooseUsData?.first?.buttonText,
      href: chooseUsData?.first?.link,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-app-text dark:text-blue-400",
    },
    {
      icon: Handshake,
      title: chooseUsData?.second?.heading,
      description: chooseUsData?.second?.description,
      buttonText: chooseUsData?.second?.buttonText,
      href: chooseUsData?.second?.link,
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-app-text dark:text-green-400",
    },
    {
      icon: Wrench,
      title: chooseUsData?.third?.heading,
      description: chooseUsData?.third?.description,
      buttonText: chooseUsData?.third?.buttonText,
      href: chooseUsData?.third?.link,
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      iconColor: "text-app-text dark:text-orange-400",
    },
    {
      icon: Calculator,
      title: chooseUsData?.fourth?.heading,
      description: chooseUsData?.fourth?.description,
      buttonText: chooseUsData?.fourth?.buttonText,
      href: chooseUsData?.fourth?.link,
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-app-text dark:text-purple-400",
    },
  ];

  return (
    <section className="mx-0 sm:mx-4 my-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 py-12 shadow-lg">
      <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h2 className="mb-4 text-3xl font-bold leading-tight text-app-text dark:text-gray-100 md:text-4xl lg:text-5xl">
            {chooseUsData?.heading || "Our Services"}
          </h2>
          <p className="mx-auto mb-5 max-w-2xl text-base text-app-text/80 dark:text-gray-300">
            Whether you are buying or selling, we are here to make your
            automotive journey seamless and rewarding
          </p>
          <div className="mx-auto h-1.5 w-16 rounded-full bg-app-button"></div>
        </div>
        
        {/* Services Grid */}
        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {services.map((service, index) => (
            <div
              key={index}
              className="group rounded-xl border border-gray-300 hover:border-app-button dark:border-gray-700 dark:hover:border-app-button bg-white dark:bg-gray-800 p-6 shadow-md transition-all duration-300 hover:shadow-lg dark:hover:shadow-xl"
            >
              {/* Icon */}
              <div className={`h-12 w-12 ${service.iconBg} mb-4 flex items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110`}>
                <service.icon className={`h-6 w-6 ${service.iconColor} group-hover:text-app-button transition-colors duration-300`} />
              </div>
              
              {/* Content */}
              <div className="mb-5 space-y-3">
                <h3 className="text-xl font-bold text-app-text group-hover:text-app-button dark:text-gray-100 dark:group-hover:text-app-button transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-app-text/80 dark:text-gray-300">
                  {service.description}
                </p>
              </div>
              
              {/* CTA Button */}
              <a href={service.href}>
                <button className="flex items-center rounded-lg bg-app-button hover:bg-app-button-hover hover:-translate-y-1 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 group-hover:shadow-lg">
                  {service.buttonText}
                  <ArrowUpRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                </button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;