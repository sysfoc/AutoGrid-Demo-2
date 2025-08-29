"use client";
import { Select, Label } from "flowbite-react";
import BrandCarsDetail from "../../components/BrandCarsDetail"
import { useParams } from "next/navigation";
export default function Home() {
  const params = useParams();
  return (
    <section className="mx-4 my-10">
      <div className="relative mt-4 flex flex-wrap justify-between gap-5 md:flex-nowrap">
        <div className="w-full p-2 md:w-1/4">
          <h3 className="mt-5 text-xl font-semibold text-blue-950 dark:text-red-500">
            Filters
          </h3>
          <div className="my-3 flex flex-col gap-y-3">
            <div>
              <Label htmlFor="model">Model</Label>
              <Select id="model">
                <option value="any">Any</option>
                <option value="$1000">$1000</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="body-type">Body Type</Label>
              <Select id="body-type">
                <option value="any">Any</option>
                <option value="$1000">$1000</option>
              </Select>
            </div>
            <div className="flex flex-row gap-3">
              <div className="w-full">
                <Label htmlFor="min-price">Min price</Label>
                <Select id="min-price">
                  <option value="any">Any</option>
                  <option value="$1000">$1000</option>
                </Select>
              </div>
              <div className="w-full">
                <Label htmlFor="max-price">Max price</Label>
                <Select id="max-price">
                  <option value="any">Any</option>
                  <option value="$1000">$1000</option>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="min-seats">Seats</Label>
              <Select id="min-seats">
                <option value="any">Any</option>
                <option value="$1000">$1000</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="fuel-type">Fuel Type</Label>
              <Select id="fuel-type">
                <option value="any">Any</option>
                <option value="$1000">$1000</option>
              </Select>
            </div>
          </div>
        </div>
        <div className="w-full md:w-5/6">
          <div>
            <h2 className="text-2xl font-semibold capitalize text-blue-950 dark:text-red-500">
              {params.brand} models
            </h2>
          </div>
          <BrandCarsDetail />
        </div>
      </div>
    </section>
  );
}
