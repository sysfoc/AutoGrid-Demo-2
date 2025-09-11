"use client";
import {
  Carousel,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Select,
  Textarea,
  TextInput,
  Spinner,
} from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { GrSort } from "react-icons/gr";
import { FiGrid, FiList } from "react-icons/fi";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useCurrency } from "../context/CurrencyContext";
import { useDistance } from "../context/DistanceContext";
import { Check } from "lucide-react";

const CardetailCard = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const searchParams = useSearchParams();
  const { currency, selectedCurrency } = useCurrency();
  const [sortOption, setSortOption] = useState("default");
  const [sortedAndFilteredCars, setSortedAndFilteredCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [userLikedCars, setUserLikedCars] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const { distance: defaultUnit, loading: distanceLoading } = useDistance();
  const [recaptchaSiteKey, setRecaptchaSiteKey] = useState(null);
  const [recaptchaStatus, setRecaptchaStatus] = useState("inactive");

  const parseBooleanParam = (param) => {
    return param === "true";
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/users/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setUserLikedCars(
          Array.isArray(data.user?.likedCars) ? data.user.likedCars : [],
        );
      }
    } catch (error) {
      return;
    }
  };

  const handleLikeToggle = async (carId) => {
    try {
      const response = await fetch("/api/users/liked-cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ carId }),
      });
      if (response.ok) {
        const data = await response.json();
        setUserLikedCars(Array.isArray(data.likedCars) ? data.likedCars : []);
        setUser((prev) => ({
          ...prev,
          likedCars: data.likedCars,
        }));
      } else {
        console.error("Failed to update liked cars");
      }
    } catch (error) {
      console.error("Error updating liked cars:", error);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  useEffect(() => {
    const fetchRecaptchaSettings = async () => {
      try {
        const response = await fetch("/api/settings/general", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.settings?.recaptcha) {
          setRecaptchaSiteKey(data.settings.recaptcha.siteKey);
          setRecaptchaStatus(data.settings.recaptcha.status);
        }
      } catch (error) {
        console.error(
          "Failed to fetch reCAPTCHA settings in CardetailCard:",
          error,
        );
      }
    };
    fetchRecaptchaSettings();
  }, []);

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    let recaptchaToken = null;
    if (
      recaptchaStatus === "active" &&
      recaptchaSiteKey &&
      typeof window.grecaptcha !== "undefined"
    ) {
      try {
        recaptchaToken = await window.grecaptcha.execute(recaptchaSiteKey, {
          action: "car_enquiry_submit",
        });
      } catch (error) {
        console.error("reCAPTCHA execution failed:", error);
        setSubmitMessage("reCAPTCHA verification failed. Please try again.");
        setIsSubmitting(false);
        return;
      }
    } else if (
      recaptchaStatus === "active" &&
      (!recaptchaSiteKey || typeof window.grecaptcha === "undefined")
    ) {
      console.error("reCAPTCHA is active but not fully loaded or configured.");
      setSubmitMessage(
        "reCAPTCHA is not ready. Please refresh the page and try again.",
      );
      setIsSubmitting(false);
      return;
    }

    const enquiryData = {
      carId: selectedCar?._id,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      recaptchaToken: recaptchaToken,
    };

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enquiryData),
      });

      const result = await response.json();
      if (response.ok) {
        setSubmitMessage(
          "Enquiry submitted successfully! We will contact you soon.",
        );
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
        });
        setTimeout(() => {
          setOpenModal(false);
          setSubmitMessage("");
          setSelectedCar(null);
        }, 2000);
      } else {
        setSubmitMessage(
          result.error || "Failed to submit enquiry. Please try again.",
        );
      }
    } catch (error) {
      console.error("Enquiry submission error:", error);
      setSubmitMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filters = useMemo(() => {
    return Object.fromEntries(searchParams.entries());
  }, [searchParams]);

  const parseArrayParam = (param) => {
    if (!param) return [];
    return Array.isArray(param) ? param : [param];
  };

  const parseNumberParam = (param) => {
    if (!param) return [];
    const parsed = Array.isArray(param)
      ? param.map((p) => Number.parseInt(p, 10)).filter(Number.isInteger)
      : [Number.parseInt(param, 10)].filter(Number.isInteger);
    return parsed;
  };

  const sortCars = (cars, sortBy) => {
    if (!cars || cars.length === 0) return cars;
    const sortedCars = [...cars];
    switch (sortBy) {
      case "price-lh":
        return sortedCars.sort((a, b) => {
          const priceA = Number.parseInt(a.price) || 0;
          const priceB = Number.parseInt(b.price) || 0;
          return priceA - priceB;
        });
      case "price-hl":
        return sortedCars.sort((a, b) => {
          const priceA = Number.parseInt(a.price) || 0;
          const priceB = Number.parseInt(b.price) || 0;
          return priceB - priceA;
        });
      case "model-latest":
        return sortedCars.sort((a, b) => {
          const yearA = Number.parseInt(a.year || a.modelYear) || 0;
          const yearB = Number.parseInt(b.year || b.modelYear) || 0;
          return yearB - yearA;
        });
      case "model-oldest":
        return sortedCars.sort((a, b) => {
          const yearA = Number.parseInt(a.year || a.modelYear) || 0;
          const yearB = Number.parseInt(b.year || b.modelYear) || 0;
          return yearA - yearB;
        });
      case "mileage-lh":
        return sortedCars.sort((a, b) => {
          const getMileage = (car) => {
            const mileageField = car.mileage || car.kms || "0";
            return (
              Number.parseInt(String(mileageField).replace(/[^\d]/g, "")) || 0
            );
          };
          return getMileage(a) - getMileage(b);
        });
      case "mileage-hl":
        return sortedCars.sort((a, b) => {
          const getMileage = (car) => {
            const mileageField = car.mileage || car.kms || "0";
            return (
              Number.parseInt(String(mileageField).replace(/[^\d]/g, "")) || 0
            );
          };
          return getMileage(b) - getMileage(a);
        });
      default:
        return sortedCars;
    }
  };

  const parsedFilters = useMemo(() => {
    return {
      keyword: filters.keyword || "",
      condition: parseArrayParam(filters.condition),
      location: parseArrayParam(filters.location),
      minPrice: filters.minPrice ? Number.parseInt(filters.minPrice, 10) : null,
      maxPrice: filters.maxPrice ? Number.parseInt(filters.maxPrice, 10) : null,
      minYear: filters.minYear || "",
      maxYear: filters.maxYear || "",
      model: parseArrayParam(filters.model),
      millageFrom: filters.millageFrom || "",
      millageTo: filters.millageTo || "",
      gearBox: parseArrayParam(filters.gearBox),
      bodyType: parseArrayParam(filters.bodyType),
      color: parseArrayParam(filters.color),
      doors: parseNumberParam(filters.doors),
      seats: parseNumberParam(filters.seats),
      fuel: parseArrayParam(filters.fuel),
      engineSizeFrom: filters.engineSizeFrom || "",
      engineSizeTo: filters.engineSizeTo || "",
      enginePowerFrom: filters.enginePowerFrom || "",
      enginePowerTo: filters.enginePowerTo || "",
      battery: filters.battery || "Any",
      charging: filters.charging || "Any",
      lease: parseBooleanParam(filters.lease) || false,
      fuelConsumption: filters.fuelConsumption || "Any",
      co2Emission: filters.co2Emission || "Any",
      driveType: parseArrayParam(filters.driveType),
    };
  }, [filters]);

  const t = useTranslations("Filters");
  const [isGridView, setIsGridView] = useState(true);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(filters).toString();
    const apiUrl = "/api";
    setLoading(true);
    fetch(`${apiUrl}/cars?${query}`)
      .then((res) => {
        if (!res.ok) {
          console.error(`API error: ${res.status} ${res.statusText}`);
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setCars(data.cars || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setCars([]);
        setLoading(false);
      });
  }, [filters]);

  useEffect(() => {
    const filtered = (cars || []).filter((car) => {
      const matchesKeyword = parsedFilters.keyword
        ? car.make
            ?.toLowerCase()
            .includes(parsedFilters.keyword.toLowerCase()) ||
          car.model?.toLowerCase().includes(parsedFilters.keyword.toLowerCase())
        : true;

      const matchesCondition = parsedFilters.condition.length
        ? parsedFilters.condition.includes(car.condition?.toLowerCase())
        : true;

      const matchesLocation = parsedFilters.location.length
        ? parsedFilters.location.some((loc) =>
            car.location?.toLowerCase().includes(loc.toLowerCase()),
          )
        : true;

      const matchesLease = parsedFilters.lease ? car.isLease : true;

      const carPrice = car.price ? Number.parseInt(car.price, 10) : null;
      const matchesPrice =
        (parsedFilters.minPrice === null && parsedFilters.maxPrice === null) ||
        (carPrice !== null &&
          (parsedFilters.minPrice === null ||
            carPrice >= parsedFilters.minPrice) &&
          (parsedFilters.maxPrice === null ||
            carPrice <= parsedFilters.maxPrice));

      const carYear = car.year || car.modelYear;
      const matchesYear =
        (!parsedFilters.minYear && !parsedFilters.maxYear) ||
        (carYear &&
          (!parsedFilters.minYear ||
            Number.parseInt(carYear, 10) >=
              Number.parseInt(parsedFilters.minYear, 10)) &&
          (!parsedFilters.maxYear ||
            Number.parseInt(carYear, 10) <=
              Number.parseInt(parsedFilters.maxYear, 10)));

      const matchesModel = parsedFilters.model.length
        ? parsedFilters.model.some((modelVal) => {
            if (car.model) {
              return modelVal.toLowerCase() === car.model.toLowerCase();
            }
            return false;
          })
        : true;

      const carMileageField = car.mileage || car.kms;
      const matchesMileage = carMileageField
        ? (() => {
            const carMileage =
              Number.parseInt(
                String(carMileageField).replace(/[^\d]/g, ""),
                10,
              ) || 0;
            const from = parsedFilters.millageFrom
              ? Number.parseInt(parsedFilters.millageFrom, 10)
              : null;
            const to = parsedFilters.millageTo
              ? Number.parseInt(parsedFilters.millageTo, 10)
              : null;
            return (!from || carMileage >= from) && (!to || carMileage <= to);
          })()
        : true;

      const matchesGearBox = parsedFilters.gearBox.length
        ? parsedFilters.gearBox.includes(car.gearbox?.toLowerCase())
        : true;

      const matchesbodyType = parsedFilters.bodyType.length
        ? parsedFilters.bodyType.includes(car.bodyType?.toLowerCase())
        : true;

      const matchesColor = parsedFilters.color.length
        ? parsedFilters.color.includes(car.color?.toLowerCase())
        : true;

      const carDoors =
        typeof car.doors === "string" && car.doors !== "Select"
          ? Number.parseInt(car.doors, 10)
          : car.doors;
      const matchesDoors = parsedFilters.doors.length
        ? parsedFilters.doors.includes(carDoors)
        : true;

      const carSeats =
        typeof car.seats === "string" && car.seats !== "Select"
          ? Number.parseInt(car.seats, 10)
          : car.seats;
      const matchesSeats = parsedFilters.seats.length
        ? parsedFilters.seats.includes(carSeats)
        : true;

      const matchesFuelType = parsedFilters.fuel.length
        ? parsedFilters.fuel.includes(car.fuelType?.toLowerCase())
        : true;

      const matchesDriveType = parsedFilters.driveType.length
        ? parsedFilters.driveType.includes(car.driveType?.toLowerCase())
        : true;

      const matchesBatteryrange = car.batteryRange
        ? (() => {
            const batteryRange =
              parsedFilters.battery !== "Any"
                ? Number.parseInt(parsedFilters.battery, 10)
                : null;
            const carBatteryRange = car.batteryRange
              ? Number.parseInt(car.batteryRange, 10)
              : null;
            return batteryRange ? carBatteryRange >= batteryRange : true;
          })()
        : true;

      const matchesChargingTime = car.chargingTime
        ? (() => {
            const chargingTime =
              parsedFilters.charging !== "Any"
                ? Number.parseInt(parsedFilters.charging, 10)
                : null;
            const carChargingTime = car.chargingTime
              ? Number.parseInt(car.chargingTime, 10)
              : null;
            return chargingTime ? carChargingTime >= chargingTime : true;
          })()
        : true;

      const matchesEngineSize =
        (!parsedFilters.engineSizeFrom ||
          Number.parseInt(String(car.engineSize), 10) >=
            Number.parseInt(parsedFilters.engineSizeFrom, 10)) &&
        (!parsedFilters.engineSizeTo ||
          Number.parseInt(String(car.engineSize), 10) <=
            Number.parseInt(parsedFilters.engineSizeTo, 10));

      const matchesEnginePower =
        (!parsedFilters.enginePowerFrom ||
          Number.parseInt(String(car.enginePower), 10) >=
            Number.parseInt(parsedFilters.enginePowerFrom, 10)) &&
        (!parsedFilters.enginePowerTo ||
          Number.parseInt(String(car.enginePower), 10) <=
            Number.parseInt(parsedFilters.enginePowerTo, 10));

      const matchesFuelConsumption = car.fuelConsumption
        ? (() => {
            const selectedFuelConsumption =
              parsedFilters.fuelConsumption !== "Any"
                ? Number.parseInt(parsedFilters.fuelConsumption, 10)
                : null;
            const carFuelConsumption = car.fuelConsumption
              ? Number.parseInt(car.fuelConsumption, 10)
              : null;
            return selectedFuelConsumption
              ? carFuelConsumption === selectedFuelConsumption
              : true;
          })()
        : true;

      const matchesCo2Emission = car.co2Emission
        ? (() => {
            const selectedCo2Emission =
              parsedFilters.co2Emission !== "Any"
                ? Number.parseInt(parsedFilters.co2Emission, 10)
                : null;
            const carCo2Emission = car.co2Emission
              ? Number.parseInt(car.co2Emission, 10)
              : null;
            return selectedCo2Emission
              ? carCo2Emission === selectedCo2Emission
              : true;
          })()
        : true;

      return (
        matchesKeyword &&
        matchesCondition &&
        matchesLocation &&
        matchesPrice &&
        matchesYear &&
        matchesModel &&
        matchesMileage &&
        matchesGearBox &&
        matchesLease &&
        matchesbodyType &&
        matchesColor &&
        matchesDoors &&
        matchesSeats &&
        matchesFuelType &&
        matchesBatteryrange &&
        matchesChargingTime &&
        matchesEngineSize &&
        matchesEnginePower &&
        matchesFuelConsumption &&
        matchesCo2Emission &&
        matchesDriveType
      );
    });
    setFilteredCars(filtered);
  }, [cars, parsedFilters]);

  useEffect(() => {
    const sorted = sortCars(filteredCars, sortOption);
    setSortedAndFilteredCars(sorted);
  }, [filteredCars, sortOption]);

  const paginationData = useMemo(() => {
    const totalItems = sortedAndFilteredCars.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = sortedAndFilteredCars.slice(startIndex, endIndex);

    return {
      totalItems,
      totalPages,
      currentItems,
      startIndex,
      endIndex: Math.min(endIndex, totalItems),
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    };
  }, [sortedAndFilteredCars, currentPage, itemsPerPage]);

  const handlePageChange = async (newPage) => {
    if (newPage === currentPage || isPageTransitioning) return;

    setIsPageTransitioning(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setTimeout(() => {
      setCurrentPage(newPage);
      setIsPageTransitioning(false);
    }, 200);
  };

  const getVisiblePageNumbers = () => {
    const { totalPages } = paginationData;
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [parsedFilters]);

  const convertKmToMiles = (km) => {
    const numericKm = Number.parseFloat(km);
    return isNaN(numericKm) ? km : (numericKm * 0.621371).toFixed(1);
  };

  const convertMilesToKm = (miles) => {
    const numericMiles = Number.parseFloat(miles);
    return isNaN(numericMiles) ? miles : (numericMiles * 1.60934).toFixed(1);
  };

  const getConvertedValues = (vehicle) => {
    if (distanceLoading || !defaultUnit || !vehicle.unit) {
      return {
        kms: vehicle.kms,
        mileage: vehicle.mileage,
        unit: vehicle.unit || defaultUnit,
      };
    }

    if (vehicle.unit === defaultUnit) {
      return {
        kms: vehicle.kms,
        mileage: vehicle.mileage,
        unit: vehicle.unit,
      };
    }

    let convertedKms = vehicle.kms;
    let convertedMileage = vehicle.mileage;

    if (vehicle.unit === "km" && defaultUnit === "miles") {
      convertedKms = convertKmToMiles(vehicle.kms);
      convertedMileage = convertKmToMiles(vehicle.mileage);
    } else if (vehicle.unit === "miles" && defaultUnit === "km") {
      convertedKms = convertMilesToKm(vehicle.miles);
      convertedMileage = convertMilesToKm(vehicle.mileage);
    }

    return {
      kms: convertedKms,
      mileage: convertedMileage,
      unit: defaultUnit,
    };
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center space-x-4 rounded-2xl bg-white px-8 py-6 shadow-sm">
          <Spinner
            aria-label="Loading vehicles"
            size="lg"
            className="text-purple-600"
          />
          <div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Loading vehicles...
            </span>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-100">
              Please wait while we fetch the latest listings
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!sortedAndFilteredCars.length) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md rounded-2xl bg-white p-8 shadow-sm">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-10 w-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.664-2.647l.835-1.252A6 6 0 0112 13a6 6 0 014.829-1.899l.835 1.252zm.835-1.252A7.962 7.962 0 0112 9c-2.34 0-4.29 1.009-5.664 2.647L5.5 10.395A9.969 9.969 0 0112 7c2.477 0 4.73.901 6.5 2.395l-.835 1.252z"
              />
            </svg>
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
            No vehicles found
          </h3>
          <p className="mb-6 text-gray-500 dark:text-gray-100">
            We could not find any vehicles matching your current filters. Try
            adjusting your search criteria or clearing some filters.
          </p>
        </div>
      </div>
    );
  }

return (
    <main className="car-listings" role="main" aria-label="Car listings and search results">
      {/* Controls Section */}
      <section 
        className="mb-6" 
        aria-label="Listing controls and filters"
      >
        <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-[var(--bg)] p-4 shadow-sm dark:border-gray-700 dark:bg-gray-700 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span 
              className="text-sm font-medium text-[var(--text-secondary)]"
              aria-live="polite"
              aria-label={`Showing ${paginationData.startIndex + 1} to ${paginationData.endIndex} of ${paginationData.totalItems} vehicles`}
            >
              <span className="font-semibold text-[var(--text)]">
                {paginationData.startIndex + 1}-{paginationData.endIndex}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[var(--text)]">
                {paginationData.totalItems}
              </span>{" "}
              vehicles
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Items per page selector */}
            <label htmlFor="items-per-page" className="sr-only">
              Items per page
            </label>
            <Select
              id="items-per-page"
              className="min-w-[120px] border-gray-300 bg-[var(--bg)] text-sm text-[var(--text)] dark:border-gray-600 dark:bg-gray-700 dark:text-[var(--text)]"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number.parseInt(e.target.value));
                setCurrentPage(1);
              }}
              aria-label="Select number of items per page"
            >
              <option value={3}>3 per page</option>
              <option value={6}>6 per page</option>
              <option value={9}>9 per page</option>
              <option value={12}>12 per page</option>
            </Select>

            {/* Sort selector */}
            <label htmlFor="sort-options" className="sr-only">
              Sort options
            </label>
            <Select
              id="sort-options"
              icon={GrSort}
              className="min-w-[160px] border-gray-300 bg-[var(--bg)] text-sm text-[var(--text)] dark:border-gray-600 dark:bg-gray-700 dark:text-[var(--text)]"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              aria-label="Sort vehicles by"
            >
              <option value="default">Sort by</option>
              <option value="price-lh">{t("priceLowToHigh")}</option>
              <option value="price-hl">{t("priceHighToLow")}</option>
              <option value="model-latest">{t("modelLatest")}</option>
              <option value="model-oldest">{t("modelOldest")}</option>
              <option value="mileage-lh">{t("mileageLowToHigh")}</option>
              <option value="mileage-hl">{t("mileageHighToLow")}</option>
            </Select>

            {/* View toggle buttons */}
            <fieldset className="flex rounded-lg border border-gray-200 bg-[var(--bg)] p-1 dark:border-gray-600 dark:bg-gray-700">
              <legend className="sr-only">Choose view layout</legend>
              <button
                type="button"
                onClick={() => setIsGridView(false)}
                className={`rounded p-2 transition-colors ${
                  !isGridView
                    ? "bg-[var(--primary)] text-[var(--text-inverse)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text)]"
                }`}
                aria-pressed={!isGridView}
                aria-label="Switch to list view"
              >
                <FiList size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setIsGridView(true)}
                className={`rounded p-2 transition-colors ${
                  isGridView
                    ? "bg-[var(--primary)] text-[var(--text-inverse)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text)]"
                }`}
                aria-pressed={isGridView}
                aria-label="Switch to grid view"
              >
                <FiGrid size={16} aria-hidden="true" />
              </button>
            </fieldset>
          </div>
        </div>
      </section>

      {/* Car Listings */}
      <section 
        className={`transition-opacity duration-200 ${isPageTransitioning ? "opacity-50" : "opacity-100"} ${
          isGridView
            ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            : "space-y-6"
        }`}
        aria-label="Available vehicles"
        aria-busy={isPageTransitioning}
      >
        {paginationData.currentItems.map((car, index) => (
          <article key={car._id} className="group">
            <Link 
              href={`car-detail/${car.slug}`}
              aria-label={`View details for ${car.make} ${car.model} - ${selectedCurrency?.symbol}${Math.round(car.price)}`}
            >
              <div
                className={`h-full overflow-hidden rounded-lg border border-gray-200 bg-[var(--bg-secondary)] shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-700 dark:hover:shadow-lg ${
                  isGridView ? "flex flex-col" : "flex flex-col sm:flex-row"
                }`}
              >
                {/* Image section */}
                <div
                  className={`relative ${isGridView ? "h-48 w-full" : "h-48 w-full flex-shrink-0 sm:h-40 sm:w-64"}`}
                >
                  <Carousel
                    slideInterval={3000}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    onPrevious={(e) => {
                      e.stopPropagation();
                    }}
                    onNext={(e) => {
                      e.stopPropagation();
                    }}
                    className="h-full w-full overflow-hidden rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none"
                    role="region"
                    aria-label={`Images of ${car.make} ${car.model}`}
                  >
                    {Array.isArray(car.imageUrls) &&
                    car.imageUrls.length > 0 ? (
                      car.imageUrls.map((image, i) => (
                        <div key={i} className="relative h-full w-full">
                          <Image
                            src={image.src || image}
                            alt={
                              image.alt ||
                              `${car.make} ${car.model} - Image ${i + 1} of ${car.imageUrls.length}`
                            }
                            width={600}
                            height={400}
                            className="h-full w-full object-cover"
                            loading={index < 3 ? "eager" : "lazy"}
                            decoding="async"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                      ))
                    ) : (
                      <div 
                        className="flex h-full items-center justify-center bg-[var(--bg-secondary)]"
                        role="img"
                        aria-label="No images available for this vehicle"
                      >
                        <div className="text-center">
                          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg)]">
                            <svg
                              className="h-8 w-8 text-[var(--text-secondary)]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <span className="text-sm text-[var(--text-secondary)]">
                            No images available
                          </span>
                        </div>
                      </div>
                    )}
                  </Carousel>

                  {/* Status banners */}
                  {!car.sold && car.tag && (
                    <div className="absolute left-0 top-0">
                      <div 
                        className="bg-[var(--primary)] px-3 py-1 text-xs font-bold text-gray-100"
                        role="status"
                        aria-label={`This vehicle is ${car.tag}`}
                      >
                        {car.tag.toUpperCase()}
                      </div>
                    </div>
                  )}

                  {car.sold && (
                    <div className="absolute left-0 top-0">
                      <div 
                        className="bg-red-500 px-3 py-1 text-xs font-bold text-gray-100"
                        role="status"
                        aria-label="This vehicle has been sold"
                      >
                        SOLD
                      </div>
                    </div>
                  )}

                  {/* Image count and favorite button */}
                  <div className="absolute right-3 top-3 flex items-center gap-2">
                    {Array.isArray(car.imageUrls) &&
                      car.imageUrls.length > 1 && (
                        <div 
                          className="flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs text-[var(--text-inverse)]"
                          aria-label={`${car.imageUrls.length} images available`}
                        >
                          <svg
                            className="h-3 w-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {car.imageUrls.length}
                        </div>
                      )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleLikeToggle(car._id);
                      }}
                      className="rounded-full bg-[var(--bg)] p-2 shadow-sm transition-colors hover:bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
                      aria-label={
                        userLikedCars &&
                        Array.isArray(userLikedCars) &&
                        userLikedCars.includes(car._id)
                          ? `Remove ${car.make} ${car.model} from favorites`
                          : `Add ${car.make} ${car.model} to favorites`
                      }
                    >
                      {userLikedCars &&
                      Array.isArray(userLikedCars) &&
                      userLikedCars.includes(car._id) ? (
                        <FaHeart className="h-4 w-4 text-red-500" aria-hidden="true" />
                      ) : (
                        <FaRegHeart className="h-4 w-4 text-[var(--text-secondary)]" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Content section */}
                <div
                  className={`flex flex-1 flex-col p-4 ${!isGridView ? "sm:p-6" : ""}`}
                >
                  {/* Title and Price */}
                  <header
                    className={`flex items-start justify-between ${isGridView ? "mb-3" : "mb-4"}`}
                  >
                    <div className="flex-1">
                      <h2
                        className={`font-bold text-[var(--text)] ${
                          isGridView ? "text-lg" : "text-xl"
                        }`}
                      >
                        {loading ? (
                          <Skeleton height={24} />
                        ) : (
                          `${car.make || "Unknown"} ${car.model || "Unknown"}`
                        )}
                      </h2>
                    </div>

                    <div className={`text-right ${!isGridView ? "ml-4" : ""}`}>
                      <div
                        className={`font-bold text-[var(--primary)] ${isGridView ? "text-xl" : "text-2xl"}`}
                        aria-label={`Price: ${selectedCurrency?.symbol}${Math.round(car.price) || 0}`}
                      >
                        {loading ? (
                          <Skeleton height={28} width={100} />
                        ) : (
                          `${selectedCurrency?.symbol}${Math.round(car.price) || 0}`
                        )}
                      </div>
                    </div>
                  </header>

                  {/* Features */}
                  {!isGridView && car.features?.length > 0 && (
                    <ul 
                      className="mb-2 grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2 lg:grid-cols-3"
                      aria-label="Vehicle features"
                    >
                      {car.features.slice(0, 6).map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]"
                        >
                          <Check className="h-3 w-3 flex-shrink-0 text-[var(--primary)]" aria-hidden="true" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Vehicle details */}
                  <div className="flex flex-wrap items-start gap-2 mb-3">
                    <span 
                      className="rounded bg-[var(--primary)] dark:text-gray-100 px-2 py-1 text-xs font-medium text-[var(--text-inverse)]"
                      aria-label={`Year: ${car.year || car.modelYear || "Unknown"}`}
                    >
                      {car.year || car.modelYear || ""}
                    </span>
                    <div className="flex flex-col md:flex-[0.8] min-w-0 text-sm text-[var(--text-secondary)]">
                      {[
                        !isGridView &&
                          (() => {
                            const v = getConvertedValues(car);
                            return `${v.kms || ""} ${v.unit || ""}`;
                          })(),
                        car.gearbox,
                        car.fuelType,
                        !isGridView && car.driveType,
                      ]
                        .filter(Boolean)
                        .join(" • ")}
                    </div>
                    {!isGridView && (
                      <div className="w-full sm:w-auto sm:flex-shrink-0 text-sm text-[var(--text-secondary)]">
                        <span className="text-sm text-[var(--text-secondary)]">
                          <span className="text-[var(--primary)]">Location:</span>{" "}
                          {car.location || "Not specified"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action button */}
                  <footer className="mt-auto">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedCar(car);
                        setOpenModal(true);
                      }}
                      className={`w-fit rounded-lg bg-[var(--primary)] dark:text-gray-100 px-3 font-medium text-[var(--text-inverse)] transition-colors hover:bg-[var(--primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 ${
                        isGridView ? "py-2 text-sm" : "py-2"
                      }`}
                      aria-label={`Enquire about ${car.make} ${car.model}`}
                    >
                      {t("enquireNow")}
                    </button>
                  </footer>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </section>

      {/* Pagination */}
      {paginationData.totalPages > 1 && (
        <nav 
          className="mt-12 flex flex-col items-center gap-6"
          role="navigation"
          aria-label="Pagination Navigation"
        >
          <div className="text-center">
            <p 
              className="text-sm text-[var(--text-secondary)]"
              aria-live="polite"
            >
              Showing{" "}
              <span className="font-semibold text-[var(--text)]">
                {paginationData.startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-[var(--text)]">
                {paginationData.endIndex}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[var(--text)]">
                {paginationData.totalItems}
              </span>{" "}
              results
            </p>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!paginationData.hasPrevPage || isPageTransitioning}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 ${
                paginationData.hasPrevPage && !isPageTransitioning
                  ? "border border-gray-300 bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--bg-secondary)] dark:border-gray-600 dark:bg-gray-700 dark:text-[var(--text)] dark:hover:bg-[var(--bg)]"
                  : "cursor-not-allowed border border-gray-200 bg-[var(--bg-secondary)] text-[var(--text-secondary)] dark:border-gray-700 dark:bg-[var(--bg)] dark:text-[var(--text-secondary)]"
              }`}
              aria-label="Go to previous page"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>

            <div className="flex items-center gap-1" role="group" aria-label="Page numbers">
              {getVisiblePageNumbers().map((pageNum, index) => (
                <div key={index}>
                  {pageNum === "..." ? (
                    <span 
                      className="px-3 py-2 text-[var(--text-secondary)]"
                      aria-hidden="true"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isPageTransitioning}
                      className={`min-w-[40px] rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 ${
                        currentPage === pageNum
                          ? "bg-[var(--primary)] text-[var(--text-inverse)]"
                          : "border border-gray-300 bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--bg-secondary)] dark:border-gray-600 dark:bg-gray-700 dark:text-[var(--text)] dark:hover:bg-[var(--bg)]"
                      } ${isPageTransitioning ? "cursor-not-allowed opacity-50" : ""}`}
                      aria-label={`Go to page ${pageNum}`}
                      aria-current={currentPage === pageNum ? "page" : undefined}
                    >
                      {pageNum}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!paginationData.hasNextPage || isPageTransitioning}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 ${
                paginationData.hasNextPage && !isPageTransitioning
                  ? "border border-gray-300 bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--bg-secondary)] dark:border-gray-600 dark:bg-gray-700 dark:text-[var(--text)] dark:hover:bg-[var(--bg)]"
                  : "cursor-not-allowed border border-gray-200 bg-[var(--bg-secondary)] text-[var(--text-secondary)] dark:border-gray-700 dark:bg-[var(--bg)] dark:text-[var(--text-secondary)]"
              }`}
              aria-label="Go to next page"
            >
              Next
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {paginationData.totalPages > 10 && (
            <div className="flex items-center gap-3">
              <label 
                htmlFor="page-jump"
                className="text-sm text-[var(--text-secondary)]"
              >
                Jump to page:
              </label>
              <input
                id="page-jump"
                type="number"
                min="1"
                max={paginationData.totalPages}
                value={currentPage}
                onChange={(e) => {
                  const page = Number.parseInt(e.target.value);
                  if (page >= 1 && page <= paginationData.totalPages) {
                    handlePageChange(page);
                  }
                }}
                className="w-16 rounded-lg border border-gray-300 bg-[var(--bg)] px-2 py-1 text-center text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-[var(--text)]"
                disabled={isPageTransitioning}
                aria-label={`Jump to page (1 to ${paginationData.totalPages})`}
              />
              <span className="text-sm text-[var(--text-secondary)]">
                of {paginationData.totalPages}
              </span>
            </div>
          )}
        </nav>
      )}

      {/* Enquiry Modal */}
      <Modal
        dismissible
        show={openModal}
        onClose={() => setOpenModal(false)}
        className="backdrop-blur-sm"
        role="dialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <ModalHeader className="border-b border-gray-200 pb-4">
          <h3 id="modal-title" className="text-2xl font-bold text-[var(--text)]">
            Get in Touch
          </h3>
          <p id="modal-description" className="mt-1 text-sm text-[var(--text-secondary)]">
            We will get back to you within 24 hours
          </p>
        </ModalHeader>
        <ModalBody className="p-6">
          <form onSubmit={handleEnquirySubmit} className="space-y-6" noValidate>
            {submitMessage && (
              <div
                className={`rounded-lg p-4 text-sm ${
                  submitMessage.includes("success")
                    ? "text-[var(--primary)]"
                    : "border border-red-200 bg-red-50 text-red-800"
                }`}
                role="alert"
                aria-live="polite"
              >
                {submitMessage}
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-sm font-semibold text-[var(--text)]"
                >
                  First Name *
                </Label>
                <TextInput
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  className="rounded-lg border-gray-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]"
                  required
                  disabled={isSubmitting}
                  aria-required="true"
                  aria-describedby="firstName-error"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-sm font-semibold text-[var(--text)]"
                >
                  Last Name *
                </Label>
                <TextInput
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  className="rounded-lg border-gray-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]"
                  required
                  disabled={isSubmitting}
                  aria-required="true"
                  aria-describedby="lastName-error"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-[var(--text)]"
                >
                  Email Address *
                </Label>
                <TextInput
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className="rounded-lg border-gray-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]"
                  required
                  disabled={isSubmitting}
                  aria-required="true"
                  aria-describedby="email-error"
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-semibold text-[var(--text)]"
                >
                  Phone Number *
                </Label>
                <TextInput
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+92 300 1234567"
                  className="rounded-lg border-gray-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]"
                  required
                  disabled={isSubmitting}
                  aria-required="true"
                  aria-describedby="phone-error"
                  autoComplete="tel"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label
                  htmlFor="message"
                  className="text-sm font-semibold text-[var(--text)]"
                >
                  Your Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell us about your requirements, budget, or any specific questions..."
                  className="resize-none rounded-lg border-gray-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]"
                  disabled={isSubmitting}
                  aria-describedby="message-help"
                />
                <div id="message-help" className="sr-only">
                  Optional message about your requirements or questions
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full rounded-lg py-4 text-lg font-semibold text-[var(--text-inverse)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 ${
                  isSubmitting
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
                }`}
                aria-describedby="submit-help"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner size="sm" aria-hidden="true" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  "Send Enquiry"
                )}
              </button>
              <div id="submit-help" className="sr-only">
                Submit form to send your enquiry. We will respond within 24 hours.
              </div>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </main>
  );
};

export default CardetailCard;