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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-md transition-colors duration-200">
        <MenuIcon className="h-5 w-5 dark:text-gray-100 text-[var(--text-inverse)]" />
        <h3 className="text-sm font-semibold text-[var(--text-inverse)] dark:text-gray-100">{t("vehicalDetail")}</h3>
      </div>

      {/* Specifications */}
      <div className="space-y-2">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-md bg-[var(--bg)] dark:bg-[var(--bg-secondary)]"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
                  <Skeleton width={80} height={16} />
                </div>
                <Skeleton width={100} height={16} />
              </div>
            ))
          : specifications.map((spec, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-md bg-[var(--bg)] dark:bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)] dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <div className="flex items-center gap-2">
                  <spec.icon className="h-4 w-4 text-[var(--primary)]" />
                  <span className="text-sm text-[var(--text)]">{spec.label}</span>
                </div>
                <span className="text-sm text-[var(--text-secondary)]">
                  {spec.value}
                </span>
              </div>
            ))}
      </div>
    </div>
  )
}

export default Tables