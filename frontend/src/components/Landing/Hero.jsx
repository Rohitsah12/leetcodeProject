// components/Landing/Hero.jsx
import React from "react";
import FloatingIcons from "./FloatingIcon";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Hero = () => {
  const { isUserAuthenticated } = useSelector((state) => state.auth);

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen bg-transparent overflow-hidden flex flex-col justify-center items-center text-center px-4 pt-5">
      {/* Background grid overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />

      {/* Floating tech icons */}
      <FloatingIcons />

      {/* Hero content */}
      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
          A Home for Indie Coders <br />
          <motion.span
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative inline-block text-black px-2"
          >
            <span className="absolute inset-0 bg-orange-500 rotate-2 z-0 rounded" />
            <span className="relative z-10 text-white">Practice</span>
          </motion.span>{" "}
          <motion.span
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative inline-block text-white px-2"
          >
            <span className="absolute inset-0 bg-orange-600 -rotate-2 z-0 rounded" />
            <span className="relative z-10 text-white">Build</span>
          </motion.span>{" "}
          <motion.span
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="relative inline-block text-white px-2"
          >
            <span className="absolute inset-0 bg-orange-400 rotate-2 z-0 rounded" />
            <span className="relative z-10 text-black">Rise</span>
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-5 text-gray-300 max-w-xl mx-auto"
        >
          Sharpen your skills with real-world challenges, community-driven tools,
          and an AI-powered platform built for modern problem solvers.
          IndieCoders is where you evolve from learner to leader.
        </motion.p>

        <motion.div
          className="mt-6 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <NavLink to={isUserAuthenticated ? "/problemset" : "/signup"}>
            <button className="px-6 py-2 bg-orange-500 text-white font-semibold rounded hover:bg-orange-600 transition duration-300">
              {isUserAuthenticated ? "Explore Problems" : "Join For Free"}
            </button>
          </NavLink>
          <button
            onClick={scrollToFeatures}
            className="px-6 py-2 border border-orange-500 text-orange-500 rounded hover:bg-orange-500 hover:text-white transition duration-300"
          >
            Explore Features
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
