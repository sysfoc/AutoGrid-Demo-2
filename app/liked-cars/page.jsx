"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdOutlineArrowOutward, MdFavorite, MdLogin } from "react-icons/md";
import { IoSpeedometer } from "react-icons/io5";
import { GiGasPump } from "react-icons/gi";
import { TbManualGearboxFilled } from "react-icons/tb";
import { FaHeart, FaEye, FaLock } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useCurrency } from "../context/CurrencyContext";

const LikedCarsPage = () => {
  const [likedCars, setLikedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [removingCarId, setRemovingCarId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const { selectedCurrency } = useCurrency();

  useEffect(() => {
    const initializePage = async () => {
      try {
        setAuthLoading(true);
        setLoading(true);
        const user = await fetchUserData();
        setIsAuthenticated(true);
        await fetchLikedCars();
      } catch (error) {
        if (error.message === "User not authenticated") {
          setIsAuthenticated(false);
        } else {
          setError(error.message);
        }
      } finally {
        setLoading(false);
        setAuthLoading(false);
      }
    };
    initializePage();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/users/me");
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("User not authenticated");
        }
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  };

  const fetchLikedCars = async () => {
    try {
      const response = await fetch("/api/users/liked-cars/cars");
      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          throw new Error("User not authenticated");
        }
        throw new Error("Failed to fetch liked cars");
      }
      const data = await response.json();
      setLikedCars(data.likedCars || []);
    } catch (error) {
      console.error("Error fetching liked cars:", error);
      if (error.message === "User not authenticated") {
        setIsAuthenticated(false);
      }
      throw error;
    }
  };

  const handleRemoveLike = async (carId) => {
    setRemovingCarId(carId);
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
        setLikedCars((prev) => prev.filter((car) => car._id !== carId));
        setUser((prev) => ({
          ...prev,
          likedCars: data.likedCars,
        }));
      } else {
        console.error("Failed to remove car from liked list");
      }
    } catch (error) {
      console.error("Error removing liked car:", error);
    } finally {
      setRemovingCarId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="mt-24 min-h-screen bg-gradient-to-br from-background-secondary to-background dark:from-background-dark dark:to-gray-900">
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-primary dark:border-gray-600 dark:border-t-primary"></div>
              <p className="text-lg text-text-secondary dark:text-text-secondary">
                Checking authentication...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mt-24 min-h-screen bg-gradient-to-br from-background-secondary to-background dark:from-background-dark dark:to-gray-900">
        <div className="container mx-auto mt-16 px-4 py-8">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary-light to-primary-light shadow-lg dark:from-primary-light dark:to-primary-light">
              <FaLock className="h-10 w-10 text-primary dark:text-primary" />
            </div>
            <h2 className="mb-4 bg-gradient-to-br from-text via-text to-text-secondary bg-clip-text text-3xl font-bold text-transparent dark:from-white dark:via-slate-100 dark:to-slate-300">
              Login Required
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-text-secondary dark:text-slate-400">
              Please log in to view your liked cars and manage your favorites
              collection.
            </p>
            <Link href="/login">
              <div className="group inline-flex transform items-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-primary-hover px-8 py-4 font-semibold text-text-inverse shadow-lg transition-all duration-300 hover:scale-105 hover:from-primary-hover hover:to-primary hover:shadow-xl">
                <MdLogin className="h-5 w-5" />
                <span>Login to Continue</span>
                <MdOutlineArrowOutward className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
            </Link>
            <div className="mt-6 space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Link href="/car-for-sale">
                  <div className="group flex items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 bg-background px-6 py-3 font-medium text-text transition-all duration-300 hover:border-gray-300 hover:bg-background-secondary hover:shadow-md dark:border-gray-700 dark:bg-background-dark dark:text-slate-400 dark:hover:border-gray-600 dark:hover:bg-gray-700">
                    <span>Browse Cars</span>
                    <MdOutlineArrowOutward className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-24 min-h-screen bg-gradient-to-br from-background-secondary to-background dark:from-background-dark dark:to-gray-900">
        <div className="container mx-auto px-4 py-20">
          <div className="rounded-lg border border-gray-200 bg-background px-8 py-12 text-center shadow-sm dark:border-gray-700 dark:bg-background-dark">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-background-secondary dark:bg-gray-700">
              <svg
                className="h-10 w-10 text-text-secondary dark:text-text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 className="mb-3 text-2xl font-semibold text-text dark:text-white">
              Authentication Required
            </h3>
            <p className="mb-8 text-text-secondary dark:text-slate-400">
              Please log in to view your liked cars and manage your favorites.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-base font-medium text-text-inverse transition-colors hover:bg-primary-hover dark:bg-primary dark:text-text-inverse dark:hover:bg-primary-hover"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-32 min-h-screen bg-gradient-to-br from-background-secondary to-background dark:from-background-dark dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-4 bg-gradient-to-br from-text via-text to-text-secondary bg-clip-text text-4xl font-bold leading-tight text-transparent dark:from-white dark:via-slate-100 dark:to-slate-300 md:text-5xl">
                My Liked Cars
              </h1>
              <p className="text-lg text-text-secondary dark:text-slate-400">
                {loading
                  ? "Loading your favorite vehicles..."
                  : `${likedCars.length} ${likedCars.length === 1 ? "vehicle" : "vehicles"} in your collection`}
              </p>
            </div>
            <Link href="/car-for-sale">
              <div className="group hidden transform items-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-primary-hover px-6 py-3 font-semibold text-text-inverse shadow-lg transition-all duration-300 hover:scale-105 hover:from-primary-hover hover:to-primary hover:shadow-2xl dark:from-primary dark:to-primary-hover dark:text-text-inverse dark:hover:from-primary-hover dark:hover:to-primary sm:inline-flex">
                <span>Browse More Cars</span>
                <MdOutlineArrowOutward className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array(6)
              .fill()
              .map((_, index) => (
                <div
                  className="overflow-hidden rounded-3xl border border-gray-100 bg-background shadow-xl dark:border-gray-700 dark:bg-background-dark"
                  key={index}
                >
                  <div className="relative">
                    <Skeleton className="h-64 w-full" />
                  </div>
                  <div className="space-y-4 p-6">
                    <div className="space-y-3">
                      <Skeleton height={28} />
                      <Skeleton height={16} width="70%" />
                    </div>
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <Skeleton circle width={32} height={32} />
                          <Skeleton height={16} width="60%" />
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 pt-4 dark:border-gray-700">
                      <Skeleton height={32} width="50%" />
                      <Skeleton height={40} className="mt-3" />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : likedCars.length === 0 ? (
          // Empty State
          <div className="py-16 text-center">
            <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-background-secondary shadow-inner dark:bg-gray-800">
              <FaHeart className="h-16 w-16 text-text-secondary" />
            </div>
            <h3 className="mb-4 text-3xl font-bold text-text dark:text-white">
              No Liked Cars Yet
            </h3>
            <p className="mx-auto mb-8 max-w-md text-lg text-text-secondary dark:text-slate-400">
              Start exploring our premium collection and save your favorite
              vehicles to see them here.
            </p>
            <Link href="/car-for-sale">
              <div className="group inline-flex transform items-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-primary-hover px-8 py-4 font-semibold text-text-inverse shadow-lg transition-all duration-300 hover:scale-105 hover:from-primary-hover hover:to-primary hover:shadow-2xl dark:from-primary dark:to-primary-hover dark:text-text-inverse dark:hover:from-primary-hover dark:hover:to-primary">
                <span>Browse Vehicles</span>
                <MdOutlineArrowOutward className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {likedCars.map((vehicle) => (
              <div
                className="group transform overflow-hidden rounded-3xl border border-gray-100 bg-background shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-gray-300 hover:shadow-2xl dark:border-gray-700 dark:bg-background-dark dark:hover:border-gray-600"
                key={vehicle._id}
              >
                <div className="relative overflow-hidden bg-background-secondary dark:bg-gray-900">
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={
                        vehicle.imageUrls?.[0] ||
                        "/placeholder.svg?height=400&width=600&text=Car+Image"
                      }
                      fill
                      alt={`${vehicle?.make} ${vehicle?.model}`}
                      className="object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                    <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
                      <div className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-text-inverse shadow-lg backdrop-blur-sm">
                        <div className="flex items-center gap-1.5">
                          <FaHeart className="h-3 w-3" />
                          Liked
                        </div>
                      </div>
                      {vehicle.sold && (
                        <div className="rounded-full bg-gray-800 px-3 py-1.5 text-xs font-semibold text-text-inverse shadow-lg backdrop-blur-sm">
                          <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-white"></div>
                            SOLD
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="absolute right-4 top-4 flex translate-x-4 transform gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                      <button
                        aria-label="Remove from Liked Cars"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveLike(vehicle._id);
                        }}
                        disabled={removingCarId === vehicle._id}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-primary shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-white hover:shadow-xl disabled:opacity-50"
                      >
                        {removingCarId === vehicle._id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        ) : (
                          <AiOutlineDelete className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        aria-label="View Car Details"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-text-secondary shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-white hover:text-primary hover:shadow-xl"
                      >
                        <FaEye className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="absolute bottom-4 right-4 rounded-2xl bg-white/95 px-4 py-2 shadow-lg backdrop-blur-md dark:bg-background-dark/95">
                      <div className="text-right">
                        <p className="text-xs font-medium text-text-secondary dark:text-slate-300">
                          Price
                        </p>
                        <p className="bg-gradient-to-r from-text to-text-secondary bg-clip-text text-lg font-bold text-transparent dark:text-slate-300">
                          {`${selectedCurrency?.symbol} ${vehicle?.price?.toLocaleString() || "N/A"}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="mb-2 text-xl font-bold text-text transition-colors duration-300 group-hover:text-primary dark:text-white dark:group-hover:text-primary">
                      {vehicle?.make} {vehicle?.model}
                    </h3>
                    <p className="line-clamp-2 text-sm leading-relaxed text-text-secondary dark:text-slate-400">
                      {vehicle?.description?.slice(0, 80)}...
                    </p>
                  </div>
                  <div className="mb-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-light dark:bg-primary-light">
                        <IoSpeedometer className="h-4 w-4 text-primary dark:text-primary" />
                      </div>
                      <span className="text-text-secondary dark:text-slate-400">
                        Mileage:
                      </span>
                      <span className="font-semibold text-text dark:text-white">
                        {vehicle?.kms || "N/A"} KM
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-light dark:bg-primary-light">
                        <GiGasPump className="h-4 w-4 text-primary dark:text-primary" />
                      </div>
                      <span className="text-text-secondary dark:text-slate-400">
                        Fuel Type:
                      </span>
                      <span className="font-semibold text-text dark:text-white">
                        {vehicle?.fuelType || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-light dark:bg-primary-light">
                        <TbManualGearboxFilled className="h-4 w-4 text-primary dark:text-primary" />
                      </div>
                      <span className="text-text-secondary dark:text-slate-400">
                        Transmission:
                      </span>
                      <span className="font-semibold text-text dark:text-white">
                        {vehicle?.gearbox || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Link
                      href={`/car-detail/${vehicle.slug || vehicle._id}`}
                      className="group/cta block w-full"
                    >
                      <div className="transform rounded-2xl bg-gradient-to-r from-primary to-primary-hover px-6 py-3.5 text-center font-semibold text-text-inverse shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-primary-hover hover:to-primary hover:shadow-xl dark:from-primary dark:to-primary-hover dark:text-text-inverse dark:hover:from-primary-hover dark:hover:to-primary">
                        <div className="flex items-center justify-center gap-2">
                          <span>View Details</span>
                          <MdOutlineArrowOutward className="h-4 w-4 transition-transform duration-300 group-hover/cta:-translate-y-1 group-hover/cta:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveLike(vehicle._id);
                      }}
                      disabled={removingCarId === vehicle._id}
                      className="group/remove flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-primary/20 bg-primary/5 px-6 py-3 font-semibold text-primary transition-all duration-300 hover:border-primary/30 hover:bg-primary/10 hover:shadow-md disabled:opacity-50 dark:border-primary/30 dark:bg-primary/20 dark:text-primary dark:hover:border-primary/40 dark:hover:bg-primary/30"
                    >
                      {removingCarId === vehicle._id ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                          <span>Removing...</span>
                        </>
                      ) : (
                        <>
                          <AiOutlineDelete className="h-4 w-4 transition-transform duration-300 group-hover/remove:scale-110" />
                          <span>Remove from Liked</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {likedCars.length > 0 && (
          <div className="mt-12 text-center sm:hidden">
            <Link href="/car-for-sale">
              <div className="group inline-flex transform items-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-primary-hover px-8 py-4 font-semibold text-text-inverse shadow-lg transition-all duration-300 hover:scale-105 hover:from-primary-hover hover:to-primary hover:shadow-2xl dark:from-primary dark:to-primary-hover dark:text-text-inverse dark:hover:from-primary-hover dark:hover:to-primary">
                <span>Browse More Cars</span>
                <MdOutlineArrowOutward className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedCarsPage;
