"use client";
import { useState } from "react";
import { ChevronDown, Bell } from "lucide-react";
import { TbSettingsCode } from "react-icons/tb";
import { FaBlog } from "react-icons/fa";
import Link from "next/link";

const Banner = () => {
  const [selectedWebsite, setSelectedWebsite] = useState("main");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

const websiteOptions = [
  { value: "main", label: "Automotive Web Solutions", url: "https://www.automotivewebsolutions.com/" },
  { value: "theme1", label: "Theme 1 – Classic", url: "https://theme1.automotivewebsolutions.com/" },
  { value: "theme2", label: "Theme 2 – Modern", url: "https://theme2.automotivewebsolutions.com/" },
  { value: "theme3", label: "Theme 3 – Premium", url: "https://theme3.automotivewebsolutions.com/" },
  { value: "theme4", label: "Theme 4 – Sporty", url: "https://theme4.automotivewebsolutions.com/" },
  { value: "theme5", label: "Theme 5 – Luxury", url: "https://theme5.automotivewebsolutions.com/" },
  { value: "theme6", label: "Theme 6 – Elegant", url: "https://theme6.automotivewebsolutions.com/" },
];

  const handleWebsiteChange = (option) => {
    setSelectedWebsite(option.value);
    setIsDropdownOpen(false);
    window.open(option.url, "_blank");
  };

  const selectedOption = websiteOptions.find(
    (option) => option.value === selectedWebsite,
  );

  return (
    <div className="fixed left-0 right-0 top-0 z-50 w-full bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-2 sm:h-16 sm:px-4">
        <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
          <div className="flex min-w-0 flex-shrink-0 items-center gap-2 sm:gap-4">
            <Link
              href="https://www.automotivewebsolutions.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex-shrink-0">
                <h1 className="text-xs font-semibold tracking-wide text-white sm:text-sm xl:text-xl">
                  <span className="block text-center sm:hidden">
                    AutoMotive
                    <br />
                    WebSolutions
                  </span>
                  <span className="hidden sm:block">
                    Automotivewebsolutions
                  </span>
                </h1>
              </div>
            </Link>
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex min-w-[75px] items-center justify-between gap-1 rounded-md bg-slate-700 px-2 py-1.5 text-xs font-medium transition-colors duration-200 hover:bg-slate-600 sm:min-w-[200px] sm:px-3 sm:py-2 sm:text-sm"
              >
                <span className="max-w-[60px] truncate sm:max-w-[100px]">
                  {selectedOption?.label}
                </span>
                <ChevronDown
                  className={`h-3 w-3 flex-shrink-0 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute left-0 top-full z-50 mt-1 min-w-[75px] sm:min-w-[200px] rounded-md border border-slate-600 bg-slate-700 shadow-lg sm:w-full">
                  {websiteOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleWebsiteChange(option)}
                      className="block w-full px-2 py-2 text-left text-xs transition-colors duration-150 first:rounded-t-md last:rounded-b-md hover:bg-slate-600 sm:px-3 sm:text-sm"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Link
            href="https://www.automotivewebsolutions.com/add-ons"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="hidden flex-shrink-0 flex-col items-center text-center lg:flex">
              <div className="mb-0.5 flex items-center gap-1">
                <TbSettingsCode size={30} className=" text-blue-300" />
                <h2 className="text-xl font-semibold text-white">
                  Theme Customization
                </h2>
              </div>
              <p className="text-blue-300 relative -right-12 -top-2 text-xs font-medium">
                Get a free quote
              </p>
            </div>
          </Link>
          <Link
            href="/blogs"
            className="hidden flex-shrink-0 flex-col items-center text-center lg:flex"
          >
            <div className="mb-0.5 flex items-center gap-1">
              <FaBlog size={28} className="text-blue-300" />
              <h2 className="text-lg font-semibold text-white">Blogs</h2>
            </div>
          </Link>

          {/* Right Section */}
          <div className="flex flex-shrink-0 items-center gap-1 sm:gap-3">
            <div className="flex flex-col items-center md:flex-row md:items-start">
              <p className="text-xs font-bold text-white lg:text-sm">
                Powered by
              </p>
              <Link
                href="https://sysfoc.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 text-xs font-bold hover:underline md:ml-1 lg:text-sm"
              >
                Sysfoc
              </Link>
            </div>

            {/* Subscribe Button / Bell Icon */}
            <div className="flex-shrink-0">
              {/* Subscribe Button - Large screens */}
              <a
                href="https://www.automotivewebsolutions.com/pricing"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-purple-700 lg:inline-flex"
              >
                Subscribe Now
              </a>

              <a
                href="https://www.automotivewebsolutions.com/pricing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 transition-colors duration-200 hover:bg-purple-700 sm:h-9 sm:w-9 lg:hidden"
              >
                <Bell className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default Banner;
