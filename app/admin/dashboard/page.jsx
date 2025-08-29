import OverviewSection from "../../components/Overview"
import ChartsSection from "../../components/Charts";
export const metadata = {
  title: "Dashboard - Auto Car Dealers",
  description: "Manage your car deals and settings from the admin dashboard.",
};

export default function Dashboard() {
  return (
    <main className="my-5 dark:bg-gray-900">
      <OverviewSection />
      <ChartsSection />
    </main>
  );
}

{/* <OrdersSection /> */}
{/* <GeoChartSection /> */}