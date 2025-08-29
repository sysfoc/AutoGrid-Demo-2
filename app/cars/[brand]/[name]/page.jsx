"use client";
import {
  Button,
  Carousel,
  Modal,
  ModalBody,
  ModalHeader,
} from "flowbite-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { IoSpeedometer } from "react-icons/io5";
import { GiGasPump } from "react-icons/gi";
import { TbManualGearbox } from "react-icons/tb";
import { GiCarDoor } from "react-icons/gi";
import { GiCarSeat } from "react-icons/gi";
import { GiPathDistance } from "react-icons/gi";
import { useState } from "react";
export default function Home() {
  const params = useParams();
  const [openModal, setOpenModal] = useState(false);

  return (
    <section className="mx-4 md:mx-36">
      <div className="mt-3 h-48 sm:h-64 xl:h-96 2xl:h-5/6">
        <Carousel slideInterval={3000}>
          <Image
            src={"/Luxury SUV.webp"}
            alt="Luxury Vam"
            width={700}
            height={500}
          />
          <Image
            src={"/Luxury SUV.webp"}
            alt="Luxury Vam"
            width={700}
            height={500}
          />
          <Image
            src={"/Luxury SUV.webp"}
            alt="Luxury Vam"
            width={700}
            height={500}
          />
          <Image
            src={"/Luxury SUV.webp"}
            alt="Luxury Vam"
            width={700}
            height={500}
          />
        </Carousel>
      </div>
      <div className="mt-5">
        <h2 className="text-2xl font-bold capitalize text-blue-950 dark:text-red-500">
          {params.brand} {params.name}
        </h2>
        <p className="text-lg">New from $155</p>
        <p className="mt-2 text-lg">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate,
          officiis voluptatem. Quisquam repellendus vero deleniti. Cumque veniam
          animi vero fuga ducimus? Id, commodi ut quia molestiae ducimus
          asperiores praesentium, dolores, eveniet culpa fugiat incidunt!
        </p>
      </div>
      <div className="mt-5 grid grid-cols-1 items-center gap-x-8 gap-y-5 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <Button
            color={"dark"}
            pill
            size={"xl"}
            onClick={() => setOpenModal(true)}
          >
            View Details
          </Button>
          <Button color={"dark"} size={"xl"} outline pill>
            Lease This Vehical
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-5 rounded bg-gray-200 p-4 dark:bg-gray-700">
          <div className="text-center">
            <div className="flex items-center justify-center">
              <IoSpeedometer fontSize={25} />
            </div>
            <p className="mt-2 text-sm">200 Miles</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center">
              <GiGasPump fontSize={25} />
            </div>
            <p className="mt-2 text-sm">Petroll</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center">
              <TbManualGearbox fontSize={25} />
            </div>
            <p className="mt-2 text-sm">Manual</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center">
              <GiCarSeat fontSize={25} />
            </div>
            <p className="mt-2 text-sm">5 Seats</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center">
              <GiCarDoor fontSize={25} />
            </div>
            <p className="mt-2 text-sm">4 Doors</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center">
              <GiPathDistance fontSize={25} />
            </div>
            <p className="mt-2 text-sm">200 Miles</p>
          </div>
        </div>
      </div>
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <ModalHeader>Price Information</ModalHeader>
        <ModalBody>
          <div className="space-y-2">
            <h3 className="font-semibold">Price Include:</h3>
            <ul className="ml-3 list-disc">
              <li>Manufacturer RRP inc. VAT</li>
              <li>Vehicle registration fee</li>
            </ul>
            <h4 className="font-semibold">Price does not include:</h4>
            <ul className="ml-3 list-disc">
              <li>First year road tax also known as VED </li>
              <li>
                Any additional charges such as delivery charge, fuel, number
                plate printing and admin fees
              </li>
            </ul>
            <h4 className="font-semibold">
              Lease from £194 per month inc. VAT on a personal lease
            </h4>
            <p>
              This price is based on a lease deal of 6,000 miles per year for a
              48-month contract and an initial upfront payment of £2,325. This
              price only applies to a personal lease. A business lease excludes
              VAT which means your the amount you pay will be different.
            </p>
            <h3 className="font-semibold">How does leasing work?</h3>
            <p>
              Leasing works a bit like a long-term car rental. You drive it but
              you dont own it.
            </p>
            <p>
              You simply lease it from the funder and drive it for an agreed
              period of time usually one to four years.
            </p>
            <p>
              You pay an initial upfront payment, and then a series of equal
              monthly payments for the agreed length of your lease, a bit like a
              phone contract.
            </p>
          </div>
        </ModalBody>
      </Modal>
    </section>
  );
}
