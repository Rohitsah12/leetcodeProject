// components/Landing/DashboardCards.jsx
import React from "react";
import UltimateCard from "./Cards/UltimatCoding";
import WideCard from "./Cards/WideCard";
import StatCard from "./Cards/StatCard";
import TopicWiseCard from "./Cards/TopicWiseCard";
import CompanyTag from "./Cards/CompanyTag";

const DashboardCards = () => {
  return (
    <div
      id="features"
      className="w-full max-w-[1440px] mx-auto px-4 py-10 space-y-6 bg-black"
    >
      {/* Top: Two Wide Cards side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UltimateCard />
        <WideCard />
      </div>

      {/* Bottom: Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StatCard
          number="200+"
          description="Successfully Implemented Coding Problems"
        />
        <StatCard
          number="+15%"
          description="Increase in Performance and Problem-Solving Success Rate"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopicWiseCard />
        <CompanyTag />
      </div>
    </div>
  );
};

export default DashboardCards;
