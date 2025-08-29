import Link from "next/link";

export default function TopBanner() {
  return (
    <div 
      className="fixed inset-x-0 top-0 z-50 w-full border-b border-slate-700 bg-slate-900 text-white"
      data-banner="top-banner"
    >
      <div className="mx-auto max-w-7xl px-4 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Premium Vehicle Services
              </h3>
              <p className="text-xs text-slate-300">
                Sell more vehicles, faster — with our powerful car-selling platform.
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden items-center space-x-2 text-xs text-slate-300 md:flex">
              <div className="h-2 w-2 rounded-full bg-green-400"></div>
              <span> Premium • Unlimited • Support</span>
            </div>
            <Link
               href="https://www.automotivewebsolutions.com/login"
              className="inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-700"
            >
               Subscribe Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}