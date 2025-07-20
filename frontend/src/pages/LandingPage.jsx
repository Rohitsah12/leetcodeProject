import React, { useEffect } from "react";
import Navbar from "../components/Landing/Navbar";
import { ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, useAnimation } from "framer-motion";
import Footer from "../components/Landing/Footer";
import Features from "../components/Landing/Features";

const companies = [
  "Google", "Amazon", "Microsoft", "Facebook", "Netflix",
  "Adobe", "Apple", "Uber", "Airbnb", "Spotify",
  "Salesforce", "Tesla", "Stripe", "LinkedIn", "Oracle",
];

const LandingPage = () => {
  const { isUserAuthenticated } = useSelector((state) => state.auth);
  const controls = useAnimation();

  useEffect(() => {
    const loopAnimation = async () => {
      while (true) {
        await controls.start({ x: -200, transition: { duration: 3, ease: "easeInOut" } });
        await controls.start({ x: 0, transition: { duration: 3, ease: "easeInOut" } });
      }
    };
    loopAnimation();
  }, [controls]);

  return (
    <div
      className="bg-black min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dltqzdtfh/image/upload/v1750446385/gridbg_uxjjws.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar />

      <div className="flex justify-center items-start px-4 pt-20 relative z-10">
        <div className="flex flex-col items-center text-white space-y-6 relative">
          <div className="text-center text-4xl md:text-5xl font-bold leading-tight">
            <h1>Master Coding</h1>
            <h1 className="mt-2">Skills Faster</h1>
          </div>

          <NavLink to={isUserAuthenticated ? "/problemset" : "/signup"}>
            <button className="flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-full hover:scale-105 transition duration-300 shadow-md">
              {isUserAuthenticated ? "Go to Practice" : "Get Started"}
              <ArrowRight size={20} />
            </button>
          </NavLink>
        </div>
      </div>

      {/* Animated Company Section */}

      <Features />
      <section className="text-center py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Where Our Learners Work
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            From startups to Fortune 500s, our alumni are building the future.
          </p>

          <div className="overflow-hidden">
            <motion.div
              className="flex gap-8 text-lg md:text-xl text-gray-700 font-semibold whitespace-nowrap"
              animate={controls}
            >
              {companies.map((company, index) => (
                <span key={index} className="px-2">
                  {company}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />

      
    </div>
  );
};

export default LandingPage;
