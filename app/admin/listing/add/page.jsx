"use client";

import {
  Button,
  Checkbox,
  FileInput,
  Label,
  Select,
  Textarea,
  TextInput,
} from "flowbite-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useCurrency } from "../../../context/CurrencyContext";

const Page = () => {
  const [dealers, setDealers] = useState([]);
  const featuresList = [
    { id: "bluetooth", label: "Bluetooth connectivity" },
    { id: "usb-ports", label: "USB ports" },
    { id: "carplay-androidauto", label: "Apple CarPlay and Android Auto" },
    { id: "wifi-hotspot", label: "Wi-Fi hotspot" },
    { id: "satellite-radio", label: "Satellite radio" },
    { id: "navigation-system", label: "Navigation system" },
    { id: "touchscreen-display", label: "Touchscreen infotainment display" },
    { id: "voice-recognition", label: "Voice recognition" },
    { id: "wireless-charging", label: "Wireless charging pad" },
    { id: "rear-seat-entertainment", label: "Rear-seat entertainment system" },
    { id: "air-conditioning", label: "Air conditioning" },
    { id: "climate-control", label: "Dual-zone or tri-zone climate control" },
    { id: "heated-seats", label: "Heated and ventilated seats" },
    { id: "power-adjustable-seats", label: "Power-adjustable seats" },
    { id: "leather-upholstery", label: "Leather upholstery" },
    { id: "keyless-entry", label: "Keyless entry and push-button start" },
    { id: "remote-start", label: "Remote start" },
    { id: "power-windows", label: "Power windows and mirrors" },
    { id: "sunroof", label: "Sunroof or moonroof" },
    { id: "ambient-lighting", label: "Ambient interior lighting" },
  ];

  const batteryRangeOptions = {
    km: [
      "Up to 100 km",
      "101–200 km",
      "201–300 km",
      "301–400 km",
      "401–500 km",
      "501–600 km",
      "601–700 km",
      "701–800 km",
      "800+ km",
    ],
    miles: [
      "Up to 62 miles",
      "63–124 miles",
      "125–186 miles",
      "187–249 miles",
      "250–311 miles",
      "312–373 miles",
      "374–435 miles",
      "436–497 miles",
      "497+ miles",
    ],
  };

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    price: "",
    tag: "default",
    description: "",
    type: "used",
    kms: "",
    fuelType: "petrol",
    fuelTankFillPrice: "",
    fuelCapacityPerTank: "",
    noOfGears: "",
    cylinder: "",
    features: {},
    doors: "",
    seats: "",
    gearbox: "manual",
    engineCapacity: "",
    images: [],
    video: "",
    sellerComments: "",
    condition: "",
    location: "",
    year: "",
    modelYear: "",
    registerationPlate: "",
    registerationExpire: "",
    mileage: "",
    bodyType: "",
    color: "",
    batteryRange: "",
    unit: "km",
    chargingTime: "",
    engineSize: "",
    enginePower: "",
    fuelConsumption: "",
    isFinance: "finance",
    slug: "",
    co2Emission: "",
    driveType: "",
    isLease: false,
    dealerId: "",
  });

  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [jsonData, setJsonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currency, selectedCurrency } = useCurrency();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/Vehicle make and model data (2).json");
        const data = await response.json();
        setJsonData(data.Sheet1);
        // Extract unique makes
        const uniqueMakes = [...new Set(data.Sheet1.map((item) => item.Maker))];
        setMakes(uniqueMakes);
      } catch (error) {
        console.error("Error loading vehicle data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJsonData();
  }, []);

  useEffect(() => {
    if (selectedMake && jsonData.length > 0) {
      const makeData = jsonData.find((item) => item.Maker === selectedMake);
      if (makeData && makeData["model "]) {
        // Split models string into array and trim whitespace
        const modelArray = makeData["model "]
          .split(",")
          .map((model) => model.trim());
        setModels(modelArray);
      } else {
        setModels([]);
      }
      setSelectedModel("");
    }
  }, [selectedMake, jsonData]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      make: selectedMake,
      model: "",
    }));
  }, [selectedMake]);

  useEffect(() => {
    if (selectedModel) {
      setFormData((prev) => ({
        ...prev,
        model: selectedModel,
      }));
    }
  }, [selectedModel]);

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const response = await fetch("/api/dealor");
        const data = await response.json();
        setDealers(data);
      } catch (error) {
        console.error("Error fetching dealers:", error);
      }
    };
    fetchDealers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        features: {
          ...prev.features,
          [name]: checked,
        },
      }));
    } else if (type === "number") {
      const numericValue = parseFloat(value);
      setFormData((prev) => ({
        ...prev,
        [name]: isNaN(numericValue) ? "" : Math.abs(numericValue),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDealerChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      dealerInfo: {
        ...prev.dealerInfo,
        [name]: value,
      },
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Prevent multiple submissions
  if (isSubmitting) return;
  
  setIsSubmitting(true);
  
  const formElement = e.target;
  const formData = new FormData(formElement);

  const selectedFeatures = featuresList
    .filter((feature) => formData.get(feature.id) === "on")
    .map((feature) => feature.label);

  formData.set("features", JSON.stringify(selectedFeatures));

  // Handle boolean field properly
  const isLease = formData.get("isLease");
  if (isLease === "on") {
    formData.set("isLease", "true");
  } else {
    formData.set("isLease", "false");
  }

  try {
    const response = await fetch("/api/cars", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    if (response.ok) {
      Swal.fire("Success!", result.message, "success");
      formElement.reset();
      // Reset state
      setSelectedMake("");
      setSelectedModel("");
      setFormData({
        make: "",
        model: "",
        price: "",
        description: "",
        type: "used",
        tag: "default",
        kms: "",
        fuelType: "petrol",
        fuelTankFillPrice: "",
        fuelCapacityPerTank: "",
        noOfGears: "",
        cylinder: "",
        features: {},
        doors: "",
        seats: "",
        gearbox: "manual",
        engineCapacity: "",
        images: [],
        video: "",
        sellerComments: "",
        condition: "",
        location: "",
        year: "",
        modelYear: "",
        registerationPlate: "",
        registerationExpire: "",
        mileage: "",
        bodyType: "",
        color: "",
        batteryRange: "",
        unit: "km",
        chargingTime: "",
        engineSize: "",
        enginePower: "",
        fuelConsumption: "",
        isFinance: "finance",
        slug: "",
        co2Emission: "",
        driveType: "",
        isLease: false,
        dealerId: "",
      });
    } else {
      Swal.fire("Error!", result.error || "Something went wrong.", "error");
    }
  } catch (error) {
    Swal.fire("Error!", "Server error occurred.", "error");
  } finally {
    // Re-enable the submit button whether successful or not
    setIsSubmitting(false);
  }
};

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="my-10">
      <h2 className="text-xl font-semibold text-app-text">Add Listing</h2>
      <div className="mt-5">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div>
            <Label htmlFor="image" className="text-app-text">Add Vehical Images Or Videos</Label>
            <FileInput type="file" name="images" multiple className="mt-1" />
          </div>
          <div>
            <h3 className="mt-3 text-sm font-semibold text-app-text dark:text-app-button">
              General Details:
            </h3>
            <div className="mb-3 mt-1 border border-gray-300"></div>
          </div>
          <div className="grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <Label htmlFor="brand-make" className="text-app-text">Vehicle Make:</Label>
              <Select
                id="brand-make"
                name="make"
                value={selectedMake}
                onChange={(e) => setSelectedMake(e.target.value)}
                aria-label="Select Make"
                className="focus:border-app-button focus:ring-app-button"
              >
                <option value="">Select Make</option>
                {makes.map((make, index) => (
                  <option key={index} value={make}>
                    {make}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="brand-Model" className="text-app-text">Brand Model:</Label>
              <Select
                id="brand-Model"
                name="model"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                aria-label="Select Model"
                disabled={!selectedMake}
                className="focus:border-app-button focus:ring-app-button"
              >
                <option value="">Select Model</option>
                {models.map((model, index) => (
                  <option key={index} value={model}>
                    {model}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="price" className="text-app-text">Price:</Label>
              <TextInput
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                addon={selectedCurrency?.name}
                className="focus:border-app-button focus:ring-app-button"
              />
            </div>
            <div>
              <Label htmlFor="type" className="text-app-text">Type:</Label>
              <Select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="focus:border-app-button focus:ring-app-button"
              >
                <option value="used">Used</option>
                <option value="new">New</option>
              </Select>
              <div className="mt-4 flex items-center gap-2">
                <Checkbox
                  id="isLease"
                  name="isLease"
                  checked={formData.isLease}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isLease: e.target.checked,
                    }))
                  }
                  className="text-app-button focus:ring-app-button"
                />
                <Label htmlFor="isLease" className="text-app-text">Available for Lease</Label>
              </div>
            </div>
            <div>
              <Label htmlFor="tag" className="text-app-text">Tag:</Label>
              <Select
                id="tag"
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                className="focus:border-app-button focus:ring-app-button"
              >
                <option value="default">Default</option>
                <option value="featured">Featured</option>
                <option value="promotion">Promotion</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="description" className="text-app-text">Description:</Label>
              <Textarea
                id="description"
                className="mb-4 h-28 focus:border-app-button focus:ring-app-button"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter a detailed description of the vehicle..."
              />
            </div>
          </div>
          <div className="mt-5">
            <div>
              <h3 className="text-sm font-semibold text-app-text dark:text-app-button">
                Driving Details:
              </h3>
              <div className="mb-3 mt-1 border border-gray-300"></div>
            </div>
            <div className="grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <Label htmlFor="total-driven" className="text-app-text">Total Driven (in km):</Label>
                <TextInput
                  id="total-driven"
                  type="number"
                  name="kms"
                  value={formData.kms}
                  onChange={handleChange}
                  className="focus:border-app-button focus:ring-app-button"
                />
              </div>
              <div>
                <Label htmlFor="fuel-type" className="text-app-text">Fuel Type:</Label>
                <Select
                  id="fuel-type"
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  className="focus:border-app-button focus:ring-app-button"
                >
                  <option value="petrol"> Petrol (Gasoline)</option>
                  <option value="diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid (Petrol/Electric)">
                    Hybrid (Petrol/Electric)
                  </option>
                  <option value="Plug-in Hybrid (PHEV)">
                    Plug-in Hybrid (PHEV)
                  </option>
                  <option value="CNG (Compressed Natural Gas)">
                    CNG (Compressed Natural Gas)
                  </option>
                  <option value="LPG (Liquefied Petroleum Gas)">
                    LPG (Liquefied Petroleum Gas)
                  </option>
                  <option value="Hydrogen Fuel Cell">Hydrogen Fuel Cell</option>
                  <option value="Ethanol (Flex-Fuel)">
                    Ethanol (Flex-Fuel)
                  </option>
                </Select>
              </div>
              <div>
                <Label htmlFor="fuel-capacity" className="text-app-text">Fuel Capacity Per Tank:</Label>
                <TextInput
                  id="fuel-capacity"
                  type="number"
                  name="fuelCapacityPerTank"
                  value={formData.fuelCapacityPerTank}
                  onChange={handleChange}
                  min="0"
                  className="focus:border-app-button focus:ring-app-button"
                />
              </div>
              <div>
                <Label htmlFor="filling-cost" className="text-app-text">Fuel Tank Fill Price:</Label>
                <TextInput
                  id="filling-cost"
                  name="fuelTankFillPrice"
                  type="number"
                  value={formData.fuelTankFillPrice}
                  onChange={handleChange}
                  min="0"
                  addon={selectedCurrency?.name}
                  className="focus:border-app-button focus:ring-app-button"
                />
              </div>
              <div>
                <Label htmlFor="gearbox" className="text-app-text">Gear Box:</Label>
                <Select
                  id="gearbox"
                  name="gearbox"
                  value={formData.gearbox}
                  onChange={handleChange}
                  className="focus:border-app-button focus:ring-app-button"
                >
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                  <option value="semi-automatic">Semi Automatic</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="noOfGears" className="text-app-text">No of Gears:</Label>
                <Select
                  id="noOfGears"
                  name="noOfGears"
                  value={formData.noOfGears}
                  onChange={handleChange}
                  className="focus:border-app-button focus:ring-app-button"
                >
                  <option value="">Select</option>
                  <option value="4">4-speed Manual</option>
                  <option value="5">5-speed Manual</option>
                  <option value="6">6-speed Manual</option>
                  <option value="7">7-speed Manual</option>
                  <option value="8">8-speed Manual</option>
                  <option value="9">9-speed Manual</option>
                  <option value="10">10-speed Manual</option>
                  <option value="11">6-speed DCT</option>
                  <option value="12">7-speed DCT</option>
                  <option value="13">8-speed DCT</option>
                  <option value="14">1-speed (Electric Cars)</option>
                  <option value="15">Sequential Transmissions</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="doors" className="text-app-text">No of Doors:</Label>
                <Select
                  id="doors"
                  name="doors"
                  value={formData.doors}
                  onChange={handleChange}
                  className="focus:border-app-button focus:ring-app-button"
                >
                  <option value="">Select</option>
                  <option value="2">2 Doors</option>
                  <option value="3">3 Doors</option>
                  <option value="4">4 Doors</option>
                  <option value="5">5 Doors</option>
                  <option value="6">6 Doors</option>
                  <option value="7">Gullwing or Butterfly Doors</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="seats" className="text-app-text">No of Seats:</Label>
                <Select
                  id="seats"
                  name="seats"
                  value={formData.seats}
                  onChange={handleChange}
                  className="focus:border-app-button focus:ring-app-button"
                >
                  <option value="">Select</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="cylinder" className="text-app-text">Cylinders:</Label>
                <Select
                  id="cylinder"
                  name="cylinder"
                  value={formData.cylinder}
                  onChange={handleChange}
                  className="focus:border-app-button focus:ring-app-button"
                >
                  <option value="">Select</option>
                  <option value="2">2 Cylinders</option>
                  <option value="3">3 Cylinders</option>
                  <option value="4">4 Cylinders</option>
                  <option value="5">5 Cylinders</option>
                  <option value="6">6 Cylinders</option>
                  <option value="8">8 Cylinders</option>
                  <option value="10">10 Cylinders</option>
                  <option value="12">12 Cylinders</option>
                  <option value="16">16 Cylinders</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="condition" className="text-app-text">Condition:</Label>
                <Select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="focus:border-app-button focus:ring-app-button"
                >
                  <option value="">Select</option>
                  <option value="new">New</option>
                  <option value="Used">Used</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="BodyType" className="text-app-text">Body Type:</Label>
                <Select
                  id="BodyType"
                  name="bodyType"
                  value={formData.bodyType}
                  onChange={handleChange}
                  className="focus:border-app-button focus:ring-app-button"
                >
                  <option value="">Select Body Type</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="SUV (Sports Utility Vehicle)">
                    SUV (Sports Utility Vehicle)
                  </option>
                  <option value="Coupe">Coupe</option>
                  <option value="Convertible">Convertible</option>
                  <option value="Wagon (Station Wagon)">
                    Wagon (Station Wagon)
                  </option>
                  <option value="Minivan">Minivan</option>
                  <option value="Roadster">Roadster</option>
                  <option value="Supercar">Supercar</option>
                  <option value="Hypercar">Hypercar</option>
                  <option value="Grand Tourer (GT)">Grand Tourer (GT)</option>
                  <option value="Van">Van</option>
                  <option value="Box Truck">Box Truck</option>
                  <option value="Flatbed Truck">Flatbed Truck</option>
                  <option value="Chassis Cab">Chassis Cab</option>
                  <option value="Panel Van">Panel Van</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="color" className="text-app-text">Color:</Label>
                <TextInput
                  id="color"
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="focus:border-app-button focus:ring-app-button"
                />
              </div>
              <div>
                <Label htmlFor="location" className="text-app-text">Location:</Label>
                <TextInput
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="focus:border-app-button focus:ring-app-button"
                />
              </div>
              <div>
                <Label htmlFor="year" className="text-app-text">Build Date:</Label>
                <TextInput
                  id="year"
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="focus:border-app-button focus:ring-app-button"
                />
              </div>
              <div>
                <Label htmlFor="modelYear" className="text-app-text">Model Year:</Label>
                <TextInput
                  id="modelYear"
                  type="text"
                  name="modelYear"
                  value={formData.modelYear}
                  onChange={handleChange}
                  className="focus:border-app-button focus:ring-app-button"
                />
              </div>
              <div>
                <Label htmlFor="registerationPlate" className="text-app-text">Registeration Plate:</Label>
                <TextInput
                  id="registerationPlate"
                  type="text"
                  name="registerationPlate"
                  value={formData.registerationPlate}
                  onChange={handleChange}
                  className="focus:border-app-button focus:ring-app-button"
                />
              </div>
              <div>
                <Label htmlFor="registerationExpire" className="text-app-text">
                  Registeration Expiry Date:
                </Label>
                <TextInput
                  id="registerationExpire"
                  type="date"
                  name="registerationExpire"
                  value={formData.registerationExpire}
                  onChange={handleChange}
                  className="focus:border-app-button focus:ring-app-button"
                />
              </div>
              <div>
                <Label htmlFor="mileage" className="text-app-text">Mileage:</Label>
                <TextInput
                  id="mileage"
                  type="text"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  className="focus:border-app-button focus:ring-app-button"
                />
              </div>
              <div>
                <Label htmlFor="unit" className="text-app-text">Select Default Unit:</Label>
                <Select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="mt-1 focus:border-app-button focus:ring-app-button"
                >
                  <option value="km">Kilometers (km)</option>
                  <option value="miles">Miles</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="batteryRange" className="text-app-text">Battery Range:</Label>
                <Select
                  id="batteryRange"
                  name="batteryRange"
                  value={formData.batteryRange}
                  onChange={handleChange}
                  className="mt-1 focus:border-app-button focus:ring-app-button"
                >
                  <option value="">Select Battery Range</option>
                  {batteryRangeOptions[formData.unit].map((range, index) => (
                    <option key={index} value={range}>
                      {range}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="chargingTime" className="text-app-text">Charging Time:</Label>
                <TextInput
                  id="chargingTime"
                  type="number"
                  name="chargingTime"
                  value={formData.chargingTime}
                  onChange={handleChange}
                  className="focus:border-app-button focus:ring-app-button"
                />
              </div>
              <div>
                <Label htmlFor="engineSize" className="text-app-text">Engine Size:</Label>
                <TextInput
                  id="engineSize"
                  type="number"
                  name="engineSize"
                  value={formData.engineSize}
                  onChange={handleChange}
                  className="focus:border-app-button focus:ring-app-button"
                />
              </div>
              <div>
                <Label htmlFor="enginePower" className="text-app-text">Engine Power:</Label>
                <TextInput
                  id="enginePower"
                  type="number"
                  name="enginePower"
                  value={formData.enginePower}
                  onChange={handleChange}
                  className="focus:border-app-button focus:ring-app-button"
                />
              </div>
              <div>
                <Label htmlFor="fuelConsumption" className="text-app-text">Fuel Consumption:</Label>
                <TextInput
                  id="fuelConsumption"
                  type="number"
                  name="fuelConsumption"
                  value={formData.fuelConsumption}
                  onChange={handleChange}
                  className="focus:border-app-button focus:ring-app-button"
                />
              </div>
              <div>
                <Label htmlFor="isFinance" className="text-app-text">Select Finance status:</Label>
                <Select
                  id="isFinance"
                  name="isFinance"
                  value={formData.isFinance}
                  onChange={handleChange}
                  className="mt-1 focus:border-app-button focus:ring-app-button"
                >
                  <option value="finance">On Finance</option>
                  <option value="paid">Paid in Full</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="co2Emission" className="text-app-text">Co2 Emission</Label>
                <TextInput
                  id="co2Emission"
                  type="number"
                  name="co2Emission"
                  value={formData.co2Emission}
                  onChange={handleChange}
                  className="focus:border-app-button focus:ring-app-button"
                />
              </div>
              <div>
                <Label htmlFor="driveType" className="text-app-text">drive Type</Label>
                <TextInput
                  id="driveType"
                  type="text"
                  name="driveType"
                  value={formData.driveType}
                  onChange={handleChange}
                  className="focus:border-app-button focus:ring-app-button"
                />
              </div>
              <div>
                <Label htmlFor="engineCapacity" className="text-app-text">Engine Capacity:</Label>
                <TextInput
                  id="engineCapacity"
                  type="text"
                  name="engineCapacity"
                  value={formData.engineCapacity}
                  onChange={handleChange}
                  className="focus:border-app-button focus:ring-app-button"
                />
              </div>
              <div>
                <Label htmlFor="video" className="text-app-text">Video URL:</Label>
                <TextInput
                  id="video"
                  type="url"
                  name="video"
                  value={formData.video}
                  onChange={handleChange}
                  className="focus:border-app-button focus:ring-app-button"
                />
              </div>
              <div>
                <Label htmlFor="slug" className="text-app-text">Slug (Optional):</Label>
                <TextInput
                  id="slug"
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="focus:border-app-button focus:ring-app-button"
                />
              </div>
            </div>
          </div>
          <div className="mt-5">
            <h3 className="text-sm font-semibold text-app-text dark:text-app-button">
              Vehicle Features:
            </h3>
            <div className="mb-3 mt-1 border border-gray-300"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {featuresList.map((feature) => (
                <div key={feature.id} className="mt-2 flex items-center gap-2">
                  <Checkbox
                    id={feature.id}
                    name={feature.id}
                    checked={formData.features[feature.id] || false}
                    onChange={handleChange}
                    className="text-app-button focus:ring-app-button"
                  />
                  <Label htmlFor={feature.id} className="text-app-text">{feature.label}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <h3 className="text-sm font-semibold text-app-text dark:text-app-button">
              Dealor Comments:
            </h3>
            <div className="mb-3 mt-1 border border-gray-300"></div>
            <div>
              <Label htmlFor="comment" className="sr-only">
                Comments:
              </Label>
              <Textarea
                id="comment"
                className="mb-12 h-72 focus:border-app-button focus:ring-app-button"
                name="sellerComments"
                value={formData.sellerComments}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-app-text dark:text-app-button">
              Contact Details
            </h3>
            <div className="mb-3 mt-1 border border-gray-300"></div>
            <div className="grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <Label htmlFor="dealerId" className="text-app-text">Select Dealer</Label>
                <Select
                  id="dealerId"
                  name="dealerId"
                  value={formData.dealerId}
                  onChange={handleChange}
                  className="mt-1 focus:border-app-button focus:ring-app-button"
                  required // Add this line
                >
                  <option value="">-- Select Dealer --</option>
                  {dealers?.map((dealer) => (
                    <option key={dealer._id} value={dealer._id}>
                      {dealer.name}-{dealer.address}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
          <div className="my-8">
         <Button 
  type="submit" 
  size={"md"} 
  disabled={isSubmitting}
  className={`w-full bg-app-button hover:bg-app-button-hover text-white border-app-button hover:border-app-button-hover ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</Button>
            <div className="mt-5 text-sm text-gray-600">
              By submitting this form, you agree to the Car Dealer App{" "}
              <Link href="/terms" className="text-app-button hover:text-app-button-hover">
                Terms of Service
              </Link>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Page;
