"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdOutlineArrowOutward } from "react-icons/md";
import { IoSpeedometer } from "react-icons/io5";
import { GiGasPump } from "react-icons/gi";
import { TbManualGearbox } from "react-icons/tb";
import { FaHeart } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTranslations } from "next-intl";
import { useCurrency } from "../context/CurrencyContext";
import { useDistance } from "../context/DistanceContext";
import { FaRegHeart } from "react-icons/fa6";
import { ChevronLeft, ChevronRight } from "lucide-react";

const VehicleCard = ({
  vehicle,
  userLikedCars,
  handleLikeToggle,
  convertedValues,
  selectedCurrency,
  currency,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = vehicle.imageUrls || [];
  const hasMultipleImages = images.length > 1;

  // Automatic image carousel
  useEffect(() => {
    if (!hasMultipleImages) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [hasMultipleImages, images.length]);

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index, e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  // Format vehicle title with condition
  const getVehicleTitle = () => {
    const condition = vehicle.condition
      ? vehicle.condition.charAt(0).toUpperCase() +
        vehicle.condition.slice(1).toLowerCase()
      : "";
    const make = vehicle.make || "";
    const model = vehicle.model || "";

    if (condition && condition !== "Default") {
      return `${condition} ${make} ${model}`.trim();
    }
    return `${make} ${model}`.trim();
  };

  return (
    <Link href={`/car-detail/${vehicle.slug || vehicle._id}`}>
      <div className="group relative flex h-full w-full transform cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 dark:border-gray-700 dark:bg-background-dark">
        {/* Image Section */}
        <div className="relative z-10">
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
            {hasMultipleImages ? (
              /* Restored original carousel implementation with style jsx for proper sliding functionality */
              <div className="carousel-container">
                <div className="carousel-track">
                  {images.map((image, index) => (
                    <div key={index} className="carousel-item">
                      <Image
                        src={image || "/placeholder.svg"}
                        fill
                        alt={`${getVehicleTitle()} - Image ${index + 1}`}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>

                <style jsx>{`
                  .carousel-container {
                    height: 100%;
                    display: flex;
                    overflow: hidden;
                  }

                  .carousel-track {
                    display: flex;
                    height: 100%;
                    transition: transform 0.5s ease-in-out;
                    transform: translateX(
                      -${currentImageIndex * (100 / images.length)}%
                    );
                    width: ${images.length * 100}%;
                  }

                  .carousel-item {
                    position: relative;
                    aspect-ratio: 4 / 3;
                    height: 100%;
                    flex-shrink: 0;
                    width: ${100 / images.length}%;
                  }
                `}</style>
              </div>
            ) : (
              /* Single Image Display */
              <Image
                src={images[0] || "/placeholder.svg"}
                fill
                alt={getVehicleTitle()}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}

            {/* Image Navigation Arrows */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary/90 text-text-inverse opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-primary-hover group-hover:opacity-100"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary/90 text-text-inverse opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-primary-hover group-hover:opacity-100"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {/* Image Progress Indicators */}
          {hasMultipleImages && (
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => goToImage(index, e)}
                  className={`h-2 rounded-full shadow-sm transition-all duration-300 ${
                    index === currentImageIndex
                      ? "w-8 bg-primary shadow-primary/50"
                      : "w-2 bg-white/70 backdrop-blur-sm hover:bg-white/90"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Tag Badge */}
          {!vehicle.sold && vehicle.tag && vehicle.tag !== "default" && (
            <div className="absolute right-3 top-3 z-20">
              <span className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-sm">
                {vehicle.tag.toUpperCase()}
              </span>
            </div>
          )}

          {vehicle.sold && (
            <div className="absolute left-5 top-20 z-10">
              <div className="origin-bottom-left -translate-x-6 -translate-y-7 -rotate-45 transform bg-gray-100 shadow-xl">
                <div className="flex w-32 items-center justify-center gap-1 px-0 py-2 text-center text-sm font-bold text-red-600">
                  <span className="inline-block h-1 w-1 rounded-full bg-red-600"></span>
                  SOLD
                </div>
              </div>
            </div>
          )}

          {/* Like Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleLikeToggle(vehicle._id);
            }}
            className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/95 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-primary-light hover:shadow-2xl dark:border-gray-600 dark:bg-background-secondary dark:hover:bg-primary-light/20"
          >
            {userLikedCars &&
            Array.isArray(userLikedCars) &&
            userLikedCars.includes(vehicle._id) ? (
              <FaHeart className="h-4 w-4 text-red-500 drop-shadow-sm" />
            ) : (
              <FaRegHeart className="h-4 w-4 text-text-secondary transition-colors duration-200 hover:text-red-500" />
            )}
          </button>
        </div>

        {/* Content Section */}
        <div className="relative z-10 flex flex-1 flex-col p-4">
          {/* Title and Price */}
          <div className="mb-3 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="line-clamp-1 text-lg font-bold leading-tight text-text dark:text-text-inverse">
                {getVehicleTitle()}
              </h3>
              <p className="text-sm font-medium text-text-secondary dark:text-text-secondary">
                {vehicle.modelYear}
              </p>
            </div>
            <div className="ml-3">
              {/* Price styling */}
              <div className="rounded-lg bg-primary px-3 py-2">
                <div className="text-sm font-bold text-white drop-shadow-sm">
                  {selectedCurrency && selectedCurrency.symbol}{" "}
                  {Math.round(
                    (vehicle &&
                      vehicle.price *
                        ((selectedCurrency && selectedCurrency.value) || 1)) /
                      ((currency && currency.value) || 1),
                  ).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Stats */}
          <div className="mt-auto grid grid-cols-3 gap-2 text-center">
            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary shadow-lg">
                <IoSpeedometer className="h-4 w-4 text-text-inverse" />
              </div>
              <div className="text-sm font-bold text-text dark:text-text-inverse">
                {convertedValues.kms}
              </div>
              <div className="text-xs font-medium text-text-secondary">
                {convertedValues.unit && convertedValues.unit.toUpperCase()}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary shadow-lg">
                <GiGasPump className="h-4 w-4 text-text-inverse" />
              </div>
              <div className="line-clamp-1 text-sm font-bold text-text dark:text-text-inverse">
                {vehicle && vehicle.fuelType}
              </div>
              <div className="text-xs font-medium text-text-secondary">
                Fuel
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary shadow-lg">
                <TbManualGearbox className="h-4 w-4 text-text-inverse" />
              </div>
              <div className="line-clamp-1 text-sm font-bold text-text dark:text-text-inverse">
                {vehicle && vehicle.gearbox}
              </div>
              <div className="text-xs font-medium text-text-secondary">
                Trans
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const VehicalsList = ({ loadingState }) => {
  const t = useTranslations("HomePage");
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currency, selectedCurrency } = useCurrency();
  const { distance: defaultUnit, loading: distanceLoading } = useDistance();
  const [userLikedCars, setUserLikedCars] = useState([]);
  const [user, setUser] = useState(null);
  const [listingData, setListingData] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [displayCount, setDisplayCount] = useState(3);

  useEffect(() => {
    const fetchListingData = async () => {
      try {
        const response = await fetch("/api/homepage");
        const result = await response.json();
        if (response.ok) {
          setListingData(result?.listingSection);
        }
      } catch (error) {
        console.error("Error fetching listing data:", error);
      }
    };
    fetchListingData();
  }, []);

  // Conversion functions with decimal precision
  const convertKmToMiles = (km) => {
    const numericKm = Number.parseFloat(km);
    return isNaN(numericKm) ? km : (numericKm * 0.621371).toFixed(1);
  };

  const convertMilesToKm = (miles) => {
    const numericMiles = Number.parseFloat(miles);
    return isNaN(numericMiles) ? miles : (numericMiles * 1.60934).toFixed(1);
  };

  // Function to convert car values based on default unit
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
      convertedKms = convertMilesToKm(vehicle.kms);
      convertedMileage = convertMilesToKm(vehicle.mileage);
    }
    return {
      kms: convertedKms,
      mileage: convertedMileage,
      unit: defaultUnit,
    };
  };

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/cars");
      if (!response.ok) throw new Error("Failed to fetch vehicles");
      const data = await response.json();
      const filteredCars = data.cars.filter(
        (car) => car.status === 1 || car.status === "1",
      );
      setVehicles(filteredCars);
      setFilteredVehicles(filteredCars);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
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

  const handleFilterChange = (filterType) => {
    setActiveFilter(filterType);
    setDisplayCount(3); // Reset display count when filter changes

    if (filterType === "all") {
      setFilteredVehicles(vehicles);
    } else {
      const filtered = vehicles.filter((vehicle) => {
        if (filterType === "for-sale") {
          return !vehicle.sold;
        }
        return (
          !vehicle.sold &&
          vehicle.tag &&
          vehicle.tag.toLowerCase() === filterType.toLowerCase()
        );
      });
      setFilteredVehicles(filtered);
    }
  };

  const handleShowMore = () => {
    setDisplayCount(prev => prev + 3);
  };

  const handleShowLess = () => {
    setDisplayCount(3);
  };

  useEffect(() => {
    fetchVehicles();
    fetchUserData();
  }, []);

  if (error) {
    return (
      <div className="mx-4 my-10 sm:mx-8 md:my-20">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
          <div className="flex items-center space-x-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
              <span className="text-sm text-white">!</span>
            </div>
            <span className="font-medium">Error: {error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (listingData && listingData.status === "inactive") {
    return null;
  }

  const displayVehicles = filteredVehicles.slice(0, displayCount);
  const hasMoreVehicles = filteredVehicles.length > displayCount;
  const showShowLessButton = displayCount > 3;

  return (
    <section className="relative my-10 overflow-hidden rounded-3xl border border-gray-200 bg-background py-12 shadow-xl backdrop-blur-sm dark:border-gray-700 dark:bg-background-dark sm:mx-8 md:my-16 md:py-16">
      <div className="relative z-10 mb-12">
        {/* Header with title and filters */}
        <div className="mb-10 flex flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center md:px-8">
          {/* Title Section */}
          <div className="flex-1">
            <h2 className="text-4xl font-bold leading-tight text-primary drop-shadow-sm md:text-5xl">
              {listingData && listingData.heading}
            </h2>
            <div className="mt-2 h-1 w-20 rounded-full bg-primary"></div>
          </div>

          <div className="flex items-center gap-4">
            <Link href={"/car-for-sale"}>
              <div className="group inline-flex transform items-center gap-3 rounded-2xl border border-primary/30 bg-primary px-6 py-3 font-bold text-text-inverse shadow-xl transition-all duration-300 hover:scale-105 hover:bg-primary-hover hover:shadow-2xl hover:shadow-primary/30">
                <span>{t("viewAll")}</span>
                <MdOutlineArrowOutward className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-10 flex flex-wrap gap-2 px-6 md:px-8">
          <button
            onClick={() => handleFilterChange("all")}
            className={`rounded-2xl px-6 py-3 text-sm font-bold shadow-lg transition-all duration-300 ${
              activeFilter === "all"
                ? "scale-105 bg-primary text-text-inverse shadow-primary/30"
                : "border border-gray-200 bg-background text-text hover:bg-primary-light hover:text-primary dark:border-gray-600 dark:text-text-inverse dark:bg-primary-light/20"
            }`}
          >
            All Cars
          </button>
          <button
            onClick={() => handleFilterChange("for-sale")}
            className={`rounded-2xl px-6 py-3 text-sm font-bold shadow-lg transition-all duration-300 ${
              activeFilter === "for-sale"
                ? "scale-105 bg-primary text-text-inverse shadow-primary/30"
                : "border border-gray-200 bg-background text-text hover:bg-primary-light hover:text-primary dark:border-gray-600 dark:text-text-inverse dark:bg-primary-light/20"
            }`}
          >
            For Sale
          </button>
          <button
            onClick={() => handleFilterChange("featured")}
            className={`rounded-2xl px-6 py-3 text-sm font-bold shadow-lg transition-all duration-300 ${
              activeFilter === "featured"
                ? "scale-105 bg-primary text-text-inverse shadow-primary/30"
                : "border border-gray-200 bg-background text-text hover:bg-primary-light hover:text-primary dark:border-gray-600 dark:text-text-inverse dark:bg-primary-light/20"
            }`}
          >
            Featured
          </button>
          <button
            onClick={() => handleFilterChange("promotion")}
            className={`rounded-2xl px-6 py-3 text-sm font-bold shadow-lg transition-all duration-300 ${
              activeFilter === "promotion"
                ? "scale-105 bg-primary text-text-inverse shadow-primary/30"
                : "border border-gray-200 bg-background text-text hover:bg-primary-light hover:text-primary dark:border-gray-600 dark:text-text-inverse dark:bg-primary-light/20"
            }`}
          >
            Promotion
          </button>
        </div>
      </div>

      {loading ? (
        <div className="relative z-10 px-6 sm:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-background shadow-lg dark:border-gray-700 dark:bg-background-dark"
              >
                <Skeleton className="h-48 w-full" />
                <div className="space-y-4 p-4">
                  <div className="flex items-start justify-between">
                    <Skeleton height={24} width="60%" />
                    <Skeleton height={32} width="30%" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center rounded-xl bg-background-secondary p-2"
                      >
                        <Skeleton circle width={32} height={32} />
                        <Skeleton height={16} width="80%" className="mt-2" />
                        <Skeleton height={12} width="60%" className="mt-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : displayVehicles.length > 0 ? (
        <div className="relative z-10 px-6 sm:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayVehicles.map((vehicle) => (
              <div key={vehicle._id} className="h-full">
                <VehicleCard
                  vehicle={vehicle}
                  userLikedCars={userLikedCars}
                  handleLikeToggle={handleLikeToggle}
                  convertedValues={getConvertedValues(vehicle)}
                  selectedCurrency={selectedCurrency}
                  currency={currency}
                />
              </div>
            ))}
          </div>
          
          {/* Show More/Show Less Buttons */}
          {(hasMoreVehicles || showShowLessButton) && (
            <div className="mt-8 flex justify-center gap-4">
              {hasMoreVehicles && (
                <button
                  onClick={handleShowMore}
                  className="group inline-flex transform items-center gap-3 rounded-2xl border border-primary/30 bg-primary px-6 py-3 font-bold text-text-inverse shadow-xl transition-all duration-300 hover:scale-105 hover:bg-primary-hover hover:shadow-2xl hover:shadow-primary/30"
                >
                  Show More
                </button>
              )}
              {showShowLessButton && (
                <button
                  onClick={handleShowLess}
                  className="group inline-flex transform items-center gap-3 rounded-2xl border border-gray-200 bg-background px-6 py-3 font-bold text-text shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-50 hover:shadow-2xl dark:border-gray-600 dark:bg-background-secondary dark:text-text-inverse dark:hover:bg-primary-light/20"
                >
                  Show Less
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="relative z-10 py-24 text-center">
          <div className="mx-auto mb-8 flex h-40 w-40 items-center justify-center rounded-full border border-gray-200 bg-background-secondary shadow-xl dark:border-gray-600 dark:bg-primary-light/20">
            <svg
              className="h-20 w-20 text-text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <h3 className="mb-6 text-3xl font-bold text-primary">
            {activeFilter === "all"
              ? "No Vehicles Available"
              : `No ${activeFilter === "for-sale" ? "Cars For Sale" : activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1) + " Cars"} Available`}
          </h3>
          <p className="mx-auto max-w-md text-lg text-text-secondary">
            {activeFilter === "all"
              ? "Our inventory is currently being updated. Please check back soon for the latest additions."
              : `No ${activeFilter === "for-sale" ? "cars for sale" : activeFilter + " cars"} found. Try selecting a different filter or check back later.`}
          </p>
        </div>
      )}
    </section>
  );
};

export default VehicalsList;