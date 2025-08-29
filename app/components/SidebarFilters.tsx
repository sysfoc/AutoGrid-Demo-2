"use client";
import { Label, Select, TextInput } from "flowbite-react";
import type React from "react";

import { useState, useEffect, useCallback, useRef } from "react";
import { SiCmake, SiGoogleearthengine } from "react-icons/si";
import { useRouter } from "next/navigation";
import { IoIosSpeedometer } from "react-icons/io";
import { IoPricetag, IoArrowDownSharp, IoArrowUpSharp } from "react-icons/io5";
import { usePathname } from "next/navigation";
import {
  FaLocationDot,
  FaRegCalendarCheck,
  FaHourglassEnd,
} from "react-icons/fa6";
import {
  GiCarDoor,
  GiGearStickPattern,
  GiCarSeat,
  GiGasPump,
  GiBatteryPack,
  GiElectric,
  GiPowerLightning,
  GiCarWheel,
} from "react-icons/gi";
import { MdOutlineCo2 } from "react-icons/md";
import { useTranslations } from "next-intl";
import { useDebouncedCallback } from "use-debounce";
import { FaHandshake } from "react-icons/fa";

// Types
interface Car {
  _id: string;
  dealerId: string;
  userId: string;
  tag: string;
  make: string;
  model: string;
  price: number;
  type: string;
  kms: string;
  sold: boolean;
  fuelType: string;
  condition: string;
  location: string;
  modelYear: string;
  mileage: string;
  bodyType: string;
  color: string;
  slug: string;
  description: string;
  imageUrls: string[];
  status: number;
  unit: string;
  createdAt: string;
  updatedAt: string;
}


const SidebarFilters = () => {
  const t = useTranslations("Filters");
  const router = useRouter();
  const [localFilters, setLocalFilters] = useState<Record<string, any>>({});
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const pathname = usePathname();
  const isLeasingPage = pathname.includes("/leasing");
  const activeInputRef = useRef<string | null>(null);
  const inputRefs = useRef<
    Record<string, HTMLInputElement | HTMLSelectElement>
  >({});
  const isUpdatingFromURL = useRef(false);
  const [cars, setCars] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    used: 0,
  });
  const [loading, setLoading] = useState(false);
const fetchCarsAndCalculateStats = async (): Promise<void> => {
  try {
    setLoading(true);
    
    const response = await fetch('/api/cars');
    const data = await response.json();
    
    setCars(data.cars);
    
    // Calculate stats based on condition
    const total: number = data.cars.length;
    const newCars: number = data.cars.filter((car: Car) => 
      car.condition && car.condition.toLowerCase() === 'new'
    ).length;
    const usedCars: number = data.cars.filter((car: Car) => 
      car.condition && car.condition.toLowerCase() === 'used'
    ).length;
    
    setStats({ total, new: newCars, used: usedCars });
    
  } catch (error) {
    console.error('Error fetching cars:', error);
  } finally {
    setLoading(false);
  }
};

// Usage
useEffect(() => {
  fetchCarsAndCalculateStats();
}, []);


  useEffect(() => {
    isUpdatingFromURL.current = true;
    const params = new URLSearchParams(window.location.search);
    const initialFilters: Record<string, any> = {};
    params.forEach((value, key) => {
      if (initialFilters[key]) {
        if (Array.isArray(initialFilters[key])) {
          initialFilters[key].push(value);
        } else {
          initialFilters[key] = [initialFilters[key], value];
        }
      } else {
        initialFilters[key] = value;
      }
    });
    setLocalFilters(initialFilters);
    setTimeout(() => {
      isUpdatingFromURL.current = false;
    }, 100);
  }, []);

  const updateURL = useCallback(() => {
    const activeElement = document.activeElement as
      | HTMLInputElement
      | HTMLSelectElement;
    const activeId = activeElement?.id || activeElement?.name;
    if (activeId && inputRefs.current[activeId]) {
      activeInputRef.current = activeId;
    }
    const params = new URLSearchParams();
    Object.entries(localFilters).forEach(([key, value]) => {
      if (key === "minPrice" || key === "maxPrice") {
        if (localFilters.minPrice && localFilters.maxPrice) {
          if (key === "minPrice" && localFilters.minPrice) {
            params.set("minPrice", localFilters.minPrice);
          }
          if (key === "maxPrice" && localFilters.maxPrice) {
            params.set("maxPrice", localFilters.maxPrice);
          }
        }
      } else if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else if (value !== undefined && value !== "") {
        params.set(key, value);
      }
    });
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [localFilters, router]);

  const debouncedUpdateURL = useDebouncedCallback(updateURL, 500);

  useEffect(() => {
    if (!isUpdatingFromURL.current) {
      debouncedUpdateURL();
    }
  }, [localFilters, debouncedUpdateURL]);

  useEffect(() => {
    if (
      activeInputRef.current &&
      inputRefs.current[activeInputRef.current] &&
      !isUpdatingFromURL.current
    ) {
      const element = inputRefs.current[activeInputRef.current];
      if (element && document.activeElement !== element) {
        setTimeout(() => {
          element.focus();
          if (element.type === "text" || element.type === "number") {
            const input = element as HTMLInputElement;
            const length = input.value.length;
            input.setSelectionRange(length, length);
          }
        }, 0);
      }
      activeInputRef.current = null;
    }
  });

  useEffect(() => {
    const handleRouteChange = () => {
      isUpdatingFromURL.current = true;
      const params = new URLSearchParams(window.location.search);
      const newFilters: Record<string, any> = {};
      params.forEach((value, key) => {
        if (newFilters[key]) {
          if (Array.isArray(newFilters[key])) {
            newFilters[key].push(value);
          } else {
            newFilters[key] = [newFilters[key], value];
          }
        } else {
          newFilters[key] = value;
        }
      });
      setLocalFilters(newFilters);
      setTimeout(() => {
        isUpdatingFromURL.current = false;
      }, 100);
    };
    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  const handleInputChange = (
    key: string,
    value: string,
    elementId?: string,
  ) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
    if (elementId) {
      activeInputRef.current = elementId;
    }
  };

  const handleCheckboxChange = (key: string, value: string) => {
    setLocalFilters((prev) => {
      const current = prev[key] || [];
      const array = Array.isArray(current) ? current : [current];
      if (array.includes(value)) {
        return {
          ...prev,
          [key]: array.filter((v) => v !== value),
        };
      } else {
        return {
          ...prev,
          [key]: [...array, value],
        };
      }
    });
  };

  const handleLeaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      handleInputChange("lease", "true", "lease-filter");
    } else {
      setLocalFilters((prev) => {
        const { lease, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleApplyFilters = () => {
    debouncedUpdateURL.flush();
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    router.replace(pathname, { scroll: false });
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((item) => item !== section)
        : [...prev, section],
    );
  };

  const setInputRef =
    (key: string) => (element: HTMLInputElement | HTMLSelectElement | null) => {
      if (element) {
        inputRefs.current[key] = element;
      } else {
        delete inputRefs.current[key];
      }
    };

  const ConditionButton = ({
    condition,
    selected,
    onClick,
  }: {
    condition: string;
    selected: boolean;
    onClick: () => void;
  }) => (
    <button
      className={`rounded-lg px-4 py-2 font-medium transition-all duration-200 ${
        selected
          ? "bg-gradient-to-r from-app-button to-app-button-hover text-white shadow-lg"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      }`}
      onClick={onClick}
    >
      {condition === "new" ? "New" : "Used"}
    </button>
  );

  // Color mapping
  const colorMap = {
    black: "#000000",
    blue: "#3b82f6",
    gray: "#6b7280",
    white: "#ffffff",
    silver: "#c0c0c0",
    red: "#ef4444",
    green: "#22c55e",
  };

  const sections = [
    {
      label: t("year"),
      content: "year",
      symbol: <FaRegCalendarCheck />,
      render: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label
                htmlFor="minYear"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                <span className="h-2 w-2 rounded-full bg-app-button"></span>
                From Year
              </Label>
              <TextInput
                type="number"
                name="minYear"
                id="minYear"
                ref={setInputRef("minYear")}
                value={localFilters.minYear || ""}
                placeholder="2010"
                onChange={(e) =>
                  handleInputChange("minYear", e.target.value, "minYear")
                }
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-800 placeholder-gray-500 shadow-lg transition-all duration-300 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 "
              />
            </div>
            <div className="space-y-3">
              <Label
                htmlFor="maxYear"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                <span className="h-2 w-2 rounded-full bg-app-button"></span>
                To Year
              </Label>
              <TextInput
                type="number"
                name="maxYear"
                id="maxYear"
                ref={setInputRef("maxYear")}
                value={localFilters.maxYear || ""}
                placeholder="2024"
                onChange={(e) =>
                  handleInputChange("maxYear", e.target.value, "maxYear")
                }
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-800 placeholder-gray-500 shadow-lg transition-all duration-300 focus:border-violet-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:ring-violet-900/50"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      label: t("mileage"),
      content: "mileage",
      symbol: <IoIosSpeedometer />,
      render: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label
                htmlFor="millageFrom"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                <span className="h-2 w-2 rounded-full bg-app-button"></span>
                {t("from")}
              </Label>
              <Select
                id="millageFrom"
                name="millageFrom"
                ref={setInputRef("millageFrom")}
                value={localFilters.millageFrom || ""}
                onChange={(e) =>
                  handleInputChange(
                    "millageFrom",
                    e.target.value,
                    "millageFrom",
                  )
                }
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-800 shadow-lg transition-all duration-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-violet-900/50"
              >
                <option value="">Any</option>
                <option value="25000">25,000 km</option>
                <option value="26000">26,000 km</option>
                <option value="27000">27,000 km</option>
              </Select>
            </div>
            <div className="space-y-3">
              <Label
                htmlFor="millageTo"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                <span className="h-2 w-2 rounded-full bg-app-button"></span>
                {t("to")}
              </Label>
              <Select
                id="millageTo"
                name="millageTo"
                ref={setInputRef("millageTo")}
                value={localFilters.millageTo || ""}
                onChange={(e) =>
                  handleInputChange("millageTo", e.target.value, "millageTo")
                }
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-800 shadow-lg transition-all duration-300 focus:border-app-button focus:ring-4 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-violet-900/50"
              >
                <option value="">Any</option>
                <option value="24000">24,000 km</option>
                <option value="26000">26,000 km</option>
                <option value="27000">27,000 km</option>
              </Select>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: t("location"),
      content: "location",
      symbol: <FaLocationDot />,
      render: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            {["Cityville", "uk", "New York", "Berlin"].map((value) => (
              <div key={value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`location-${value}`}
                  checked={
                    Array.isArray(localFilters.location) &&
                    localFilters.location.includes(value)
                  }
                  onChange={() => handleCheckboxChange("location", value)}
                  className="h-4 w-4 rounded border-gray-300 text-app-button focus:ring-violet-500"
                />
                <label
                  htmlFor={`location-${value}`}
                  className="ml-3 text-sm text-gray-700 dark:text-gray-300"
                >
                  {value}
                </label>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      label: t("price"),
      content: "price",
      symbol: <IoPricetag />,
      render: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label
                htmlFor="minPrice"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                <span className="h-2 w-2 rounded-full bg-app-button"></span>
                Minimum Price
              </Label>
              <Select
                id="minPrice"
                name="minPrice"
                ref={setInputRef("minPrice")}
                value={localFilters.minPrice || ""}
                onChange={(e) =>
                  handleInputChange("minPrice", e.target.value, "minPrice")
                }
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-800 shadow-lg transition-all duration-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-violet-900/50"
              >
                <option value="">Any Min</option>
                <option value="100">$100</option>
                <option value="500">$500</option>
                <option value="1000">$1,000</option>
                <option value="5000">$5,000</option>
                <option value="10000">$10,000</option>
                <option value="15000">$15,000</option>
                <option value="20000">$20,000</option>
                <option value="25000">$25,000</option>
                <option value="30000">$30,000</option>
                <option value="40000">$40,000</option>
                <option value="50000">$50,000</option>
              </Select>
            </div>
            <div className="space-y-3">
              <Label
                htmlFor="maxPrice"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                Maximum Price
              </Label>
              <Select
                id="maxPrice"
                name="maxPrice"
                ref={setInputRef("maxPrice")}
                value={localFilters.maxPrice || ""}
                onChange={(e) =>
                  handleInputChange("maxPrice", e.target.value, "maxPrice")
                }
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-800 shadow-lg transition-all duration-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-violet-900/50"
              >
                <option value="">Any Max</option>
                <option value="500">$500</option>
                <option value="1000">$1,000</option>
                <option value="5000">$5,000</option>
                <option value="10000">$10,000</option>
                <option value="15000">$15,000</option>
                <option value="20000">$20,000</option>
                <option value="25000">$25,000</option>
                <option value="30000">$30,000</option>
                <option value="40000">$40,000</option>
                <option value="50000">$50,000</option>
                <option value="75000">$75,000</option>
                <option value="100000">$100,000</option>
              </Select>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Model",
      content: "Model",
      symbol: <SiCmake />,
      render: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            {["Corolla", "sequoio", "147", "146", "159"].map((value) => (
              <div key={value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`model-${value}`}
                  checked={
                    Array.isArray(localFilters.model) &&
                    localFilters.model.includes(value)
                  }
                  onChange={() => handleCheckboxChange("model", value)}
                  className="h-4 w-4 rounded border-gray-300 text-app-button focus:ring-violet-500"
                />
                <label
                  htmlFor={`model-${value}`}
                  className="ml-3 text-sm text-gray-700 dark:text-gray-300"
                >
                  {value}
                </label>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      label: t("gearbox"),
      content: "gearbox",
      symbol: <GiGearStickPattern />,
      render: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            {["automatic", "manual"].map((value) => (
              <div key={value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`gearbox-${value}`}
                  checked={
                    Array.isArray(localFilters.gearBox) &&
                    localFilters.gearBox.includes(value)
                  }
                  onChange={() => handleCheckboxChange("gearBox", value)}
                  className="h-4 w-4 rounded border-gray-300 text-app-button focus:ring-violet-500"
                />
                <label
                  htmlFor={`gearbox-${value}`}
                  className="ml-3 text-sm capitalize text-gray-700 dark:text-gray-300"
                >
                  {value}
                </label>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      label: t("body"),
      content: "bodytype",
      symbol: <GiCarDoor />,
      render: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            {[
              "convertible",
              "coupe",
              "estate",
              "hatchback",
              "saloon",
              "suv",
            ].map((value) => (
              <div key={value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`body-${value}`}
                  checked={
                    Array.isArray(localFilters.bodyType) &&
                    localFilters.bodyType.includes(value)
                  }
                  onChange={() => handleCheckboxChange("bodyType", value)}
                  className="h-4 w-4 rounded border-gray-300 text-app-button focus:ring-violet-500"
                />
                <label
                  htmlFor={`body-${value}`}
                  className="ml-3 text-sm capitalize text-gray-700 dark:text-gray-300"
                >
                  {value}
                </label>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      label: t("doors"),
      content: "doors",
      symbol: <GiCarDoor />,
      render: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {["2", "3", "4", "5"].map((value) => (
              <div key={value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`doors-${value}`}
                  checked={
                    Array.isArray(localFilters.doors) &&
                    localFilters.doors.includes(value)
                  }
                  onChange={() => handleCheckboxChange("doors", value)}
                  className="h-4 w-4 rounded border-gray-300 text-app-button focus:ring-violet-500"
                />
                <label
                  htmlFor={`doors-${value}`}
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  {value} Doors
                </label>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      label: t("seats"),
      content: "Seats",
      symbol: <GiCarSeat />,
      render: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {["2", "3", "4", "5", "7"].map((value) => (
              <div key={value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`seats-${value}`}
                  checked={
                    Array.isArray(localFilters.seats) &&
                    localFilters.seats.includes(value)
                  }
                  onChange={() => handleCheckboxChange("seats", value)}
                  className="h-4 w-4 rounded border-gray-300 text-app-button focus:ring-violet-500"
                />
                <label
                  htmlFor={`seats-${value}`}
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  {value} Seats
                </label>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      label: t("fuel"),
      content: "fueltype",
      symbol: <GiGasPump />,
      render: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            {["petrol", "diesel", "electric", "hybrid", "bi-fuel"].map(
              (value) => (
                <div key={value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`fuel-${value}`}
                    checked={
                      Array.isArray(localFilters.fuel) &&
                      localFilters.fuel.includes(value)
                    }
                    onChange={() => handleCheckboxChange("fuel", value)}
                    className="h-4 w-4 rounded border-gray-300 text-app-button focus:ring-violet-500"
                  />
                  <label
                    htmlFor={`fuel-${value}`}
                    className="ml-3 text-sm capitalize text-gray-700 dark:text-gray-300"
                  >
                    {value}
                  </label>
                </div>
              ),
            )}
          </div>
        </div>
      ),
    },
    {
      label: t("battery"),
      content: "battery",
      symbol: <GiBatteryPack />,
      render: (
        <div className="space-y-3">
          <Label
            htmlFor="battery"
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            <span className="h-2 w-2 rounded-full bg-app-button"></span>
            Select Range
          </Label>
          <Select
            id="battery"
            ref={setInputRef("battery")}
            value={localFilters.battery || "Any"}
            onChange={(e) =>
              handleInputChange("battery", e.target.value, "battery")
            }
            className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-800 shadow-lg transition-all duration-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-violet-900/50"
          >
            <option value="Any">Any Range</option>
            <option value="100">0-100 Miles</option>
            <option value="1000">100-200 Miles</option>
            <option value="2000">200+ Miles</option>
          </Select>
        </div>
      ),
    },
    {
      label: t("charging"),
      content: "charging",
      symbol: <GiElectric />,
      render: (
        <div className="space-y-3">
          <Label
            htmlFor="charging"
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            <span className="h-2 w-2 rounded-full bg-app-button"></span>
            Maximum Charging Rate
          </Label>
          <Select
            id="charging"
            ref={setInputRef("charging")}
            value={localFilters.charging || "Any"}
            onChange={(e) =>
              handleInputChange("charging", e.target.value, "charging")
            }
            className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-800 shadow-lg transition-all duration-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-violet-900/50"
          >
            <option value="Any">Any Speed</option>
            <option value="100">Standard (0-50kW)</option>
            <option value="1000">Fast (50-150kW)</option>
            <option value="2000">Rapid (150kW+)</option>
          </Select>
        </div>
      ),
    },
    {
      label: t("engineSize"),
      content: "engine-size",
      symbol: <SiGoogleearthengine />,
      render: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label
                htmlFor="engine-from"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                <span className="h-2 w-2 rounded-full bg-app-button"></span>
                {t("from")}
              </Label>
              <Select
                id="engine-from"
                ref={setInputRef("engineSizeFrom")}
                value={localFilters.engineSizeFrom || ""}
                onChange={(e) =>
                  handleInputChange(
                    "engineSizeFrom",
                    e.target.value,
                    "engineSizeFrom",
                  )
                }
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-800 shadow-lg transition-all duration-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-violet-900/50"
              >
                <option value="">Any</option>
                <option value="0">0.0L</option>
                <option value="1">1.0L</option>
                <option value="2">2.0L</option>
              </Select>
            </div>
            <div className="space-y-3">
              <Label
                htmlFor="engine-to"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                {t("to")}
              </Label>
              <Select
                id="engine-to"
                ref={setInputRef("engineSizeTo")}
                value={localFilters.engineSizeTo || ""}
                onChange={(e) =>
                  handleInputChange(
                    "engineSizeTo",
                    e.target.value,
                    "engineSizeTo",
                  )
                }
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-800 shadow-lg transition-all duration-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-violet-900/50"
              >
                <option value="">Any</option>
                <option value="0">0.0L</option>
                <option value="1">1.0L</option>
                <option value="2">2.0L</option>
              </Select>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: t("enginePower"),
      content: "engine-power",
      symbol: <GiPowerLightning />,
      render: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label
                htmlFor="engine-power-from"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                <span className="h-2 w-2 rounded-full bg-app-button"></span>
                {t("from")}
              </Label>
              <Select
                id="engine-power-from"
                ref={setInputRef("enginePowerFrom")}
                value={localFilters.enginePowerFrom || "Any"}
                onChange={(e) =>
                  handleInputChange(
                    "enginePowerFrom",
                    e.target.value,
                    "enginePowerFrom",
                  )
                }
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-800 shadow-lg transition-all duration-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-violet-900/50"
              >
                <option value="Any">Any</option>
                <option value="50">50 bhp</option>
                <option value="100">100 bhp</option>
                <option value="150">150 bhp</option>
              </Select>
            </div>
            <div className="space-y-3">
              <Label
                htmlFor="engine-power-to"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                {t("to")}
              </Label>
              <Select
                id="engine-power-to"
                ref={setInputRef("enginePowerTo")}
                value={localFilters.enginePowerTo || "Any"}
                onChange={(e) =>
                  handleInputChange(
                    "enginePowerTo",
                    e.target.value,
                    "enginePowerTo",
                  )
                }
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-800 shadow-lg transition-all duration-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-violet-900/50"
              >
                <option value="Any">Any</option>
                <option value="50">50 bhp</option>
                <option value="100">100 bhp</option>
                <option value="150">150 bhp</option>
              </Select>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: t("fuelConsumption"),
      content: "fuel-comsumption",
      symbol: <FaHourglassEnd />,
      render: (
        <div className="space-y-3">
          <Label
            htmlFor="fuel-comsumption"
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            <span className="h-2 w-2 rounded-full bg-app-button"></span>
            Minimum MPG
          </Label>
          <Select
            id="fuel-comsumption"
            ref={setInputRef("fuelConsumption")}
            value={localFilters.fuelConsumption || "Any"}
            onChange={(e) =>
              handleInputChange(
                "fuelConsumption",
                e.target.value,
                "fuelConsumption",
              )
            }
            className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-800 shadow-lg transition-all duration-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-violet-900/50"
          >
            <option value="Any">Any MPG</option>
            <option value="30">30+ MPG</option>
            <option value="40">40+ MPG</option>
            <option value="50">50+ MPG</option>
            <option value="60">60+ MPG</option>
          </Select>
        </div>
      ),
    },
    {
      label: t("co2"),
      content: "c02-emission",
      symbol: <MdOutlineCo2 />,
      render: (
        <div className="space-y-3">
          <Label
            htmlFor="c02-emission"
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            <span className="h-2 w-2 rounded-full bg-app-button"></span>
            Maximum CO2 Output
          </Label>
          <Select
            id="c02-emission"
            ref={setInputRef("co2Emission")}
            value={localFilters.co2Emission || "Any"}
            onChange={(e) =>
              handleInputChange("co2Emission", e.target.value, "co2Emission")
            }
            className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-800 shadow-lg transition-all duration-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-violet-900/50"
          >
            <option value="Any">Any Emission</option>
            <option value="30">Up to 30 g/km CO2</option>
            <option value="75">Up to 75 g/km CO2</option>
            <option value="100">Up to 100 g/km CO2</option>
            <option value="110">Up to 110 g/km CO2</option>
            <option value="120">Up to 120 g/km CO2</option>
          </Select>
        </div>
      ),
    },
    {
      label: t("driveType"),
      content: "drive-type",
      symbol: <GiCarWheel />,
      render: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            {["four", "front", "rear"].map((value) => (
              <div key={value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`drive-${value}`}
                  checked={
                    Array.isArray(localFilters.driveType) &&
                    localFilters.driveType.includes(value)
                  }
                  onChange={() => handleCheckboxChange("driveType", value)}
                  className="h-4 w-4 rounded border-gray-300 text-app-button focus:ring-violet-500"
                />
                <label
                  htmlFor={`drive-${value}`}
                  className="ml-3 text-sm text-gray-700 dark:text-gray-300"
                >
                  {value === "four"
                    ? "Four Wheel Drive"
                    : value === "front"
                      ? "Front Wheel Drive"
                      : "Rear Wheel Drive"}
                </label>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  const isLightColor = (colorId: any) => ["white", "silver"].includes(colorId);

  const visibleSections = sections.filter(
    (section) => section.content !== "lease",
  );

  // Get total count for condition tabs
  const getTotalCount = () => {
    // This would normally come from your data/API
    return 100;
  };

  const getNewCount = () => {
    // This would normally come from your data/API
    return 29;
  };

  const getUsedCount = () => {
    // This would normally come from your data/API
    return 71;
  };

  return (
    <div className="space-y-4">
      {/* Main Filter Rows */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {/* First Row */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-5">
          {/* Make */}
          <div>
            <Select
              id="make"
              ref={setInputRef("make")}
              value={localFilters.make || ""}
              onChange={(e) =>
                handleInputChange("make", e.target.value, "make")
              }
              className="w-full border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300"
            >
              <option value="">Make</option>
              <option value="toyota">Toyota</option>
              <option value="bmw">BMW</option>
              <option value="mercedes">Mercedes</option>
              <option value="audi">Audi</option>
            </Select>
          </div>

          {/* Model */}
          <div>
            <Select
              id="model"
              ref={setInputRef("model")}
              value={localFilters.model || ""}
              onChange={(e) =>
                handleInputChange("model", e.target.value, "model")
              }
              className="w-full border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300"
            >
              <option value="">Model</option>
              <option value="corolla">Corolla</option>
              <option value="sequoia">Sequoia</option>
              <option value="147">147</option>
              <option value="146">146</option>
              <option value="159">159</option>
            </Select>
          </div>

          {/* Location */}
          <div className="relative">
            <Select
              id="location"
              ref={setInputRef("location")}
              value={localFilters.location || ""}
              onChange={(e) =>
                handleInputChange("location", e.target.value, "location")
              }
              className="w-full border-gray-300 pl-8 text-gray-700 dark:border-gray-600 dark:text-gray-300"
            >
              <option value="">Location</option>
              <option value="cityville">Cityville</option>
              <option value="uk">UK</option>
              <option value="new-york">New York</option>
              <option value="berlin">Berlin</option>
            </Select>
            <FaLocationDot className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-purple-500" />
          </div>

          {/* Distance */}
          <div>
            <Select
              id="distance"
              ref={setInputRef("distance")}
              value={localFilters.distance || ""}
              onChange={(e) =>
                handleInputChange("distance", e.target.value, "distance")
              }
              className="w-full border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300"
            >
              <option value="">Distance</option>
              <option value="5">Within 5 miles</option>
              <option value="10">Within 10 miles</option>
              <option value="25">Within 25 miles</option>
              <option value="50">Within 50 miles</option>
            </Select>
          </div>

          {/* Type */}
          <div>
            <Select
              id="bodyType"
              ref={setInputRef("bodyType")}
              value={localFilters.bodyType || ""}
              onChange={(e) =>
                handleInputChange("bodyType", e.target.value, "bodyType")
              }
              className="w-full border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300"
            >
              <option value="">Type</option>
              <option value="convertible">Convertible</option>
              <option value="coupe">Coupe</option>
              <option value="estate">Estate</option>
              <option value="hatchback">Hatchback</option>
              <option value="saloon">Saloon</option>
              <option value="suv">SUV</option>
            </Select>
          </div>
        </div>

        {/* Second Row */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Min Price */}
          <div>
            <TextInput
              type="text"
              id="minPrice"
              name="minPrice"
              ref={setInputRef("minPrice")}
              value={localFilters.minPrice || ""}
              placeholder="Min Price"
              onChange={(e) =>
                handleInputChange("minPrice", e.target.value, "minPrice")
              }
              className="w-full border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300"
            />
          </div>

          {/* Max Price */}
          <div>
            <TextInput
              type="text"
              id="maxPrice"
              name="maxPrice"
              ref={setInputRef("maxPrice")}
              value={localFilters.maxPrice || ""}
              placeholder="Max Price"
              onChange={(e) =>
                handleInputChange("maxPrice", e.target.value, "maxPrice")
              }
              className="w-full border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300"
            />
          </div>

          {/* Mileage */}
          <div>
            <Select
              id="mileage"
              ref={setInputRef("mileage")}
              value={localFilters.mileage || ""}
              onChange={(e) =>
                handleInputChange("mileage", e.target.value, "mileage")
              }
              className="w-full border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300"
            >
              <option value="">Mileage</option>
              <option value="25000">Up to 25,000 km</option>
              <option value="50000">Up to 50,000 km</option>
              <option value="100000">Up to 100,000 km</option>
            </Select>
          </div>

          {/* Drive Type */}
          <div>
            <Select
              id="driveType"
              ref={setInputRef("driveType")}
              value={localFilters.driveType || ""}
              onChange={(e) =>
                handleInputChange("driveType", e.target.value, "driveType")
              }
              className="w-full border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300"
            >
              <option value="">Drive Type</option>
              <option value="four">Four Wheel Drive</option>
              <option value="front">Front Wheel Drive</option>
              <option value="rear">Rear Wheel Drive</option>
            </Select>
          </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-6">
          {/* Fuel Type */}
          <div>
            <Select
              id="fuel"
              ref={setInputRef("fuel")}
              value={localFilters.fuel || ""}
              onChange={(e) =>
                handleInputChange("fuel", e.target.value, "fuel")
              }
              className="w-full border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300"
            >
              <option value="">Fuel Type</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
              <option value="hybrid">Hybrid</option>
              <option value="bi-fuel">Bi-fuel</option>
            </Select>
          </div>

          {/* Features */}
          <div>
            <Select
              id="features"
              ref={setInputRef("features")}
              value={localFilters.features || ""}
              onChange={(e) =>
                handleInputChange("features", e.target.value, "features")
              }
              className="w-full border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300"
            >
              <option value="">Features</option>
              <option value="sunroof">Sunroof</option>
              <option value="leather">Leather Seats</option>
              <option value="navigation">Navigation</option>
              <option value="bluetooth">Bluetooth</option>
            </Select>
          </div>

          {showMoreFilters && (
            <>
              {/* Gearbox */}
              <div>
                <Select
                  id="gearBox"
                  ref={setInputRef("gearBox")}
                  value={localFilters.gearBox || ""}
                  onChange={(e) =>
                    handleInputChange("gearBox", e.target.value, "gearBox")
                  }
                  className="w-full border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300"
                >
                  <option value="">Gearbox</option>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </Select>
              </div>

              {/* Doors */}
              <div>
                <Select
                  id="doors"
                  ref={setInputRef("doors")}
                  value={localFilters.doors || ""}
                  onChange={(e) =>
                    handleInputChange("doors", e.target.value, "doors")
                  }
                  className="w-full border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300"
                >
                  <option value="">Doors</option>
                  <option value="2">2 Doors</option>
                  <option value="3">3 Doors</option>
                  <option value="4">4 Doors</option>
                  <option value="5">5 Doors</option>
                </Select>
              </div>
            </>
          )}

          {/* Spacer */}
          <div></div>

          {/* Clear all and More filters */}
          <div className="flex justify-end gap-2">
            <button
              onClick={handleClearFilters}
              className="text-sm font-medium text-purple-500 hover:text-purple-600"
            >
              Clear all
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className="flex items-center gap-1 text-sm font-medium text-purple-500 hover:text-purple-600"
            >
              More filters
              {showMoreFilters ? (
                <IoArrowUpSharp className="h-3 w-3" />
              ) : (
                <IoArrowDownSharp className="h-3 w-3" />
              )}
            </button>
          </div>
        </div>

        {showMoreFilters && (
          <div className="mt-4 grid grid-cols-1 gap-4 border-t border-gray-200 pt-4 dark:border-gray-700 md:grid-cols-5">
            {/* Seats */}
            <div>
              <Select
                id="seats"
                ref={setInputRef("seats")}
                value={localFilters.seats || ""}
                onChange={(e) =>
                  handleInputChange("seats", e.target.value, "seats")
                }
                className="w-full border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300"
              >
                <option value="">Seats</option>
                <option value="2">2 Seats</option>
                <option value="3">3 Seats</option>
                <option value="4">4 Seats</option>
                <option value="5">5 Seats</option>
                <option value="7">7 Seats</option>
              </Select>
            </div>

            {/* Engine Size */}
            <div>
              <Select
                id="engineSize"
                ref={setInputRef("engineSize")}
                value={localFilters.engineSize || ""}
                onChange={(e) =>
                  handleInputChange("engineSize", e.target.value, "engineSize")
                }
                className="w-full border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300"
              >
                <option value="">Engine Size</option>
                <option value="1.0">1.0L</option>
                <option value="1.5">1.5L</option>
                <option value="2.0">2.0L</option>
                <option value="3.0">3.0L</option>
              </Select>
            </div>

            {/* Year */}
            <div>
              <Select
                id="year"
                ref={setInputRef("year")}
                value={localFilters.year || ""}
                onChange={(e) =>
                  handleInputChange("year", e.target.value, "year")
                }
                className="w-full border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300"
              >
                <option value="">Year</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
              </Select>
            </div>

            {/* Color */}
            <div>
              <Select
                id="color"
                ref={setInputRef("color")}
                value={localFilters.color || ""}
                onChange={(e) =>
                  handleInputChange("color", e.target.value, "color")
                }
                className="w-full border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300"
              >
                <option value="">Color</option>
                <option value="black">Black</option>
                <option value="white">White</option>
                <option value="silver">Silver</option>
                <option value="blue">Blue</option>
                <option value="red">Red</option>
              </Select>
            </div>

            {/* Lease */}
            {!isLeasingPage && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="lease-filter"
                  checked={localFilters.lease === "true"}
                  onChange={handleLeaseChange}
                  className="h-4 w-4 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                />
                <label
                  htmlFor="lease-filter"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  Lease only
                </label>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Row - Condition Tabs and Search */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          {/* Left side - Condition tabs */}
          <div className="flex gap-6">
            <button
              onClick={() => {
                setLocalFilters((prev) => {
                  const { condition, ...rest } = prev;
                  return rest;
                });
              }}
              className={`border-b-2 pb-2 text-sm font-medium transition-colors ${
                !localFilters.condition ||
                (Array.isArray(localFilters.condition) &&
                  localFilters.condition.length === 0)
                  ? "border-purple-500 text-purple-500"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => handleCheckboxChange("condition", "new")}
              className={`border-b-2 pb-2 text-sm font-medium transition-colors ${
                Array.isArray(localFilters.condition) &&
                localFilters.condition.includes("new")
                  ? "border-purple-500 text-purple-500"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              New ({stats.new})
            </button>
            <button
              onClick={() => handleCheckboxChange("condition", "used")}
              className={`border-b-2 pb-2 text-sm font-medium transition-colors ${
                Array.isArray(localFilters.condition) &&
                localFilters.condition.includes("used")
                  ? "border-purple-500 text-purple-500"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Used ({stats.used})
            </button>
          </div>

          {/* Right side - Compare and Search */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <TextInput
                type="text"
                id="keyword-search"
                name="keyword-search"
                ref={setInputRef("keyword-search")}
                value={localFilters.keyword || ""}
                placeholder="Enter keyword"
                onChange={(e) =>
                  handleInputChange("keyword", e.target.value, "keyword-search")
                }
                className="w-64 border-gray-300 pr-10 text-gray-700 dark:border-gray-600 dark:text-gray-300"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* More Filters Expandable Section */}
    </div>
  );
};

export default SidebarFilters;
