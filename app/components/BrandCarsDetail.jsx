import Image from "next/image";
import React from "react";
import { IoSpeedometer } from "react-icons/io5";
import { GiGasPump } from "react-icons/gi";
import { TbManualGearbox } from "react-icons/tb";
import Link from "next/link";
const BrandCarsDetail = () => {
  const vehicals = [
    {
      brand: "toyota",
      name: "corrola",
      image: "/Luxury SUV.webp",
      type: "Hatchback",
      startingPrice: 150,
      fuelType: "Petrol",
      driven: 50,
      transmission: "Automatic",
    },
  ];
  return (
    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
      {vehicals.map((vehical, index) => {
        return (
          <div className="shadow-md" key={index}>
            <div>
              <Image
                src={`${vehical.image}`}
                alt={`${vehical.name}`}
                width={500}
                height={300}
               className="size-full custom-image"
              />
            </div>
            <div className="p-4">
              <div>
                <Link href={`/cars/${vehical.brand}/${vehical.name}`}>
                  <h2 className="text-xl font-semibold uppercase text-blue-950 dark:text-red-500">
                    {vehical.brand}
                  </h2>
                </Link>
                <p className="mt-1 capitalize">{vehical.name}</p>
                <p className="mt-1 capitalize">{vehical.type} </p>
              </div>
              <div className="my-3 grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <IoSpeedometer fontSize={25} />
                  </div>
                  <p className="mt-2 text-sm">{vehical.driven} Miles</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <GiGasPump fontSize={25} />
                  </div>
                  <p className="mt-2 text-sm">{vehical.fuelType}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <TbManualGearbox fontSize={25} />
                  </div>
                  <p className="mt-2 text-sm">{vehical.transmission}</p>
                </div>
              </div>
              <div className="mt-2 border-gray-300 custom-border"></div>
              <div className="mt-2">
                <p>New From ${vehical.startingPrice}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BrandCarsDetail;
