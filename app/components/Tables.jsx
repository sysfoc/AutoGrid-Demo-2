import { MenuIcon } from "lucide-react"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { 
  Car, DoorOpen, Users, Settings, Fuel, Wrench, Zap, Activity
} from "lucide-react";

const Tables = ({ loadingState, carData, translation: t }) => {
  const loading = loadingState

  const specifications = [
    { label: "Vehicle", value: carData?.make, icon: Car },
    { label: "Doors", value: carData?.doors || "Not provided", icon: DoorOpen },
    { label: "Seats", value: carData?.seats || "Not provided", icon: Users },
    { label: "Cylinders", value: carData?.cylinder || "Not provided", icon: Settings },
    { label: "Fuel Type", value: carData?.fuelType || "Not provided", icon: Fuel },
    { label: "Gearbox", value: carData?.gearbox || "Not provided", icon: Wrench },
    { label: "Gears", value: carData?.noOfGears || "Not provided", icon: Zap },
    { label: "Capacity", value: carData?.engineCapacity || "Not provided", icon: Activity },
  ]

  return (
  <div className="space-y-4" role="region" aria-label="Vehicle specifications">
    {/* Header */}
    <div className="flex items-center gap-2 p-3 bg-purple-600 rounded-md" role="banner" aria-label="Vehicle details section header">
      <MenuIcon className="h-5 w-5 text-white" role="img" aria-label="Menu icon" />
      <h3 className="text-sm font-semibold text-white" role="heading" aria-level="3">{t("vehicalDetail")}</h3>
    </div>

    {/* Specifications */}
    <div className="space-y-2" role="list" aria-label="Vehicle specifications list">
      {loading
        ? Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-md" role="listitem" aria-label="Loading specification">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded" role="img" aria-label="Loading icon" />
                <Skeleton width={80} height={16} aria-label="Loading specification label" />
              </div>
              <Skeleton width={100} height={16} aria-label="Loading specification value" />
            </div>
          ))
        : specifications.map((spec, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-md" role="listitem" aria-label={`${spec.label}: ${spec.value}`}>
              <div className="flex items-center gap-2">
                <spec.icon className="h-4 w-4 text-purple-600 dark:text-purple-400" role="img" aria-label={`${spec.label} icon`} />
                <span className="text-sm text-gray-900 dark:text-white" role="term">{spec.label}</span>
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300" role="definition" aria-label={`Value: ${spec.value}`}>
                {spec.value}
              </span>
            </div>
          ))}
    </div>
  </div>
)
}

export default Tables
