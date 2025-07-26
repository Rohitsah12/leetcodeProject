// components/Landing/Cards/WideCard.jsx
import React from "react";

const WideCard = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black shadow-xl rounded-2xl p-8 border border-orange-500/30 h-full">
      <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
        <span role="img" aria-label="robot">🤖</span> Indie Code AI Assistant
      </h2>
      <p className="text-orange-400 text-base leading-relaxed mb-4">
        An intelligent, independent AI coding assistant designed to help you solve problems,
        debug efficiently, and boost productivity with real-time suggestions as you code.
      </p>
      <img
        src="/images/ai_assistant.jpg"
        alt="Indie Code AI Assistant"
        className="rounded-lg shadow w-full max-h-[300px] object-cover border border-orange-500/20"
      />
    </div>
  );
};

export default WideCard;
