// components/Landing/Cards/CompanyTag.jsx
import React from "react";

const CompanyTag = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black shadow-xl rounded-2xl p-8 border border-orange-500/30 h-full">
      <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
        <span role="img" aria-label="rocket">🏬</span> Company Specific Questions
      </h2>
      <p className="text-orange-400 text-base leading-relaxed mb-4">
        Tackle real-world coding challenges designed to mirror industry scenarios. Our curated problem sets help you sharpen logic, improve efficiency, and build job-ready skills—right from our interactive, AI-powered workspace.
      </p>
      <img 
        src="/images/company_Tag.jpg" 
        alt="Company Specific Questions" 
        className="rounded-lg shadow border border-orange-500/20" 
      />
    </div>
  );
};

export default CompanyTag;
