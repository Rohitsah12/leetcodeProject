import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const features = [
  {
    title: "Company Problem Tagging",
    description: "Filter problems by top companies like Google, Amazon, etc.",
    icon: "🏢",
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    bgGradient: "from-gray-900 to-black"
  },
  {
    title: "Topic-wise Practice",
    description: "Sharpen your DSA skills with focused topic-wise questions.",
    icon: "🎯",
    gradient: "from-yellow-400 via-orange-400 to-red-500",
    bgGradient: "from-gray-800 to-gray-900"
  },
  {
    title: "Detailed Editorials",
    description: "Understand every solution with rich explanations and diagrams.",
    icon: "📚",
    gradient: "from-amber-500 via-yellow-500 to-orange-500",
    bgGradient: "from-black to-gray-900"
  },
  {
    title: "AI Doubt Assistant",
    description: "Ask questions and get instant help from an AI mentor.",
    icon: "🤖",
    gradient: "from-orange-600 via-amber-600 to-yellow-400",
    bgGradient: "from-gray-900 to-black"
  },
  {
    title: "Code Discussion Forum",
    description: "Discuss questions and share solutions with peers.",
    icon: "💬",
    gradient: "from-yellow-500 via-orange-500 to-amber-500",
    bgGradient: "from-gray-800 to-black"
  },
  {
    title: "Submission History",
    description: "Track your past submissions, results, and performance.",
    icon: "📊",
    gradient: "from-orange-400 via-yellow-400 to-amber-400",
    bgGradient: "from-black to-gray-800"
  },
  {
    title: "User Profile",
    description: "Showcase your skills, badges, and achievements.",
    icon: "👤",
    gradient: "from-amber-600 via-orange-500 to-yellow-500",
    bgGradient: "from-gray-900 to-gray-800"
  },
  {
    title: "Event Tracker",
    description: "Will get the coding contest information from various platforms like Codeforces, CodeChef, LeetCode, AtCoder",
    icon: "⏱️",
    gradient: "from-yellow-600 via-amber-500 to-orange-600",
    bgGradient: "from-black to-gray-900"
  }
];

export default function Feature() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isPaused, index]);

  const goToPrevious = () => {
    setIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const goToNext = () => {
    setIndex((prev) => (prev + 1) % features.length);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-16 px-6 relative">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-400 bg-clip-text text-transparent">
            Features
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover the powerful tools that make{" "}
            <span className="text-orange-400 font-semibold">indieCode</span> the ultimate coding practice platform
          </p>
        </motion.div>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-yellow-500/20 rounded-3xl blur-3xl" />

        <div
          className="relative h-80 md:h-96"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Arrows */}
          <motion.button
            onClick={goToPrevious}
            aria-label="Previous feature"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 backdrop-blur-sm border border-orange-500/30 rounded-full flex items-center justify-center text-orange-400 hover:bg-black/70 hover:text-yellow-400 transition-all duration-300 group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          <motion.button
            onClick={goToNext}
            aria-label="Next feature"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 backdrop-blur-sm border border-orange-500/30 rounded-full flex items-center justify-center text-orange-400 hover:bg-black/70 hover:text-yellow-400 transition-all duration-300 group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>

          {/* Slide */}
          <AnimatePresence mode="wait">
            <motion.div
              key={features[index].title}
              initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={`absolute inset-0 bg-gradient-to-br ${features[index].bgGradient} rounded-3xl shadow-2xl backdrop-blur-sm border border-orange-500/30 overflow-hidden group cursor-pointer`}
            >
              {/* Inner Decorations */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-gradient-to-r from-orange-400/30 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                <div className="absolute bottom-0 -right-4 w-96 h-96 bg-gradient-to-l from-amber-400/20 to-transparent rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
              </div>

              {/* Feature Content */}
              <div className="relative z-10 h-full flex flex-col justify-center items-center p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="text-8xl mb-6 filter drop-shadow-lg"
                >
                  {features[index].icon}
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className={`text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r ${features[index].gradient} bg-clip-text text-transparent`}
                >
                  {features[index].title}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed font-medium"
                >
                  {features[index].description}
                </motion.p>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>

     

        {/* Feature Counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >

        </motion.div>
      </div>

      {/* Decorative Bars */}
      <div className="absolute top-1/2 left-0 w-2 h-32 bg-gradient-to-b from-orange-500 to-yellow-500 rounded-full opacity-40 blur-sm"></div>
      <div className="absolute top-1/3 right-0 w-2 h-24 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full opacity-40 blur-sm"></div>
    </div>
  );
}
