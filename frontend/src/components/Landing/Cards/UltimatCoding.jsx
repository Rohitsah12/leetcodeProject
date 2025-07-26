// components/Landing/Cards/UltimateCoding.jsx
import React from "react";
import codingWorkspaceImage from "../../../../public/images/coding_workspace.jpg";

const UltimateCoding = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black shadow-xl rounded-2xl p-8 border border-orange-500/30 h-full">
      <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
        <span role="img" aria-label="rocket">🚀</span> Ultimate Coding Workspace
      </h2>
      <p className="text-orange-400 text-base leading-relaxed mb-4">
        We offer a rich workspace for solving coding problems with a wide range of tools and features.
      </p>
      <img 
        src={codingWorkspaceImage} 
        alt="Coding Workspace" 
        className="rounded-lg shadow border border-orange-500/20" 
      />
    </div>
  );
};

export default UltimateCoding;
