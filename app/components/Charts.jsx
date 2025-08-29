import React from "react";
import PieChart from "./PieChart";
import BarChart from "./BarChart";

const Charts = () => {
  return (
    <section className="my-5">
      <div className="flex flex-wrap items-center gap-4 md:flex-nowrap">
        <BarChart />
        <PieChart />
      </div>
    </section>
  );
};

export default Charts;
