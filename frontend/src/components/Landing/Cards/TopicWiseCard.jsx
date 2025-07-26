// components/Landing/Cards/TopicWiseCard.jsx
import React from "react";

const TopicWiseCard = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black shadow-xl rounded-2xl p-8 border border-orange-500/30 h-full">
      <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
        <span role="img" aria-label="rocket">🎯</span> Topic Wise Questions
      </h2>
      <p className="text-orange-400 text-base leading-relaxed mb-4">
        Master every concept with curated coding problems organized by topic. Whether it's arrays, recursion, or dynamic programming—practice step-by-step and build confidence with structured problem sets designed for progressive learning.
      </p>
      <img 
        src="/images/topic wise.jpg" 
        alt="Topic Wise Questions" 
        className="rounded-lg shadow border border-orange-500/20" 
      />
    </div>
  );
};

export default TopicWiseCard;
