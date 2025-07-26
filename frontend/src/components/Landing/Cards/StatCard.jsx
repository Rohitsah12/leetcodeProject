// components/Landing/Cards/StatCard.jsx
import React from "react";

const StatCard = ({ number, description }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black shadow-xl rounded-xl p-6 border border-orange-500/30 text-center h-full">
      <h3 className="text-3xl font-bold text-orange-500">{number}</h3>
      <p className="text-white mt-2">{description}</p>
    </div>
  );
};

export default StatCard;
