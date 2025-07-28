// components/Landing/Hero.jsx
import React, { useState, useEffect } from "react";
import FloatingIcons from "./FloatingIcon";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Hero = () => {
  const { isUserAuthenticated } = useSelector((state) => state.auth);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const words = ["Practice", "Build", "Rise", "Learn", "Code", "Grow"];
  const colors = [
    "bg-orange-500",
    "bg-orange-600", 
    "bg-orange-400",
    "bg-orange-700",
    "bg-orange-500",
    "bg-orange-600"
  ];

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < currentWord.length) {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
        } else {
          // Start deleting after a pause
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 100 : 150);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words]);

  return (
    <section className="relative min-h-screen bg-transparent overflow-hidden flex flex-col justify-center items-center text-center px-4 pt-5">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />
        
        {/* Floating gradient orbs */}
        <motion.div
          className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-orange-500/20 to-orange-600/20 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '20%', left: '10%' }}
        />
        
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-orange-400/15 to-orange-500/15 blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          style={{ bottom: '10%', right: '5%' }}
        />
      </div>

      {/* Floating tech icons */}
      {/* <FloatingIcons /> */}

      {/* Hero content */}
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Main Heading with Typewriter Effect */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-7xl font-black text-white leading-tight mb-6">
            A Home for Indie Coders
          </h1>
          
          {/* Typewriter Section */}
          <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
            <span className="text-3xl md:text-5xl font-bold text-white">Let's</span>
            
            <motion.div 
              className="relative inline-block"
              key={currentWordIndex}
            >
              <motion.span
                className={`absolute inset-0 ${colors[currentWordIndex]} z-0 rounded-lg`}
                animate={{ rotate: [2, -2, 2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="relative z-10 text-3xl md:text-5xl font-bold text-white px-4 py-2">
                {currentText}
                <motion.span
                  className="inline-block w-1 h-8 md:h-12 bg-orange-300 ml-1"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </span>
            </motion.div>
            
            <span className="text-3xl md:text-5xl font-bold text-white">Together</span>
          </div>
        </motion.div>

        {/* Subtitle with enhanced animation */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8"
        >
          Sharpen your skills with{" "}
          <motion.span 
            className="text-orange-400 font-semibold"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            real-world challenges
          </motion.span>
          , community-driven tools, and an AI-powered platform built for modern problem solvers.
          <br />
          <span className="text-orange-300">IndieCoders is where you evolve from learner to leader.</span>
        </motion.p>

        {/* Enhanced CTA Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <NavLink to={isUserAuthenticated ? "/problemset" : "/signup"}>
            <motion.button 
              className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl overflow-hidden shadow-xl hover:shadow-orange-500/25 transition-all duration-300"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 30px rgba(251, 146, 60, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10 flex items-center gap-2">
                {isUserAuthenticated ? "Start Coding Now" : "Join For Free"}
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          </NavLink>
          
          <motion.button
            onClick={scrollToFeatures}
            className="group px-8 py-4 border-2 border-orange-500 text-orange-500 font-bold rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-300 backdrop-blur-sm"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(251, 146, 60, 0.1)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center gap-2">
              Explore Features
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                ✨
              </motion.div>
            </span>
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-orange-500/50 rounded-full flex justify-center cursor-pointer"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            onClick={scrollToFeatures}
          >
            <motion.div
              className="w-1 h-3 bg-orange-500 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
