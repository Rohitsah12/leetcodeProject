// components/Landing/CompanyMarquee.jsx
import React from "react";
import { motion } from "framer-motion";

const companies = [
  "Google", "Amazon", "Microsoft", "Facebook", "Netflix",
  "Adobe", "Apple", "Uber", "Airbnb", "Spotify",
  "Salesforce", "Tesla", "Stripe", "LinkedIn", "Oracle",
];

const CompanyMarquee = () => {
  return (
    <div className="bg-black py-12 overflow-hidden border-t border-orange-500/20">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">
          Where Our Learners Work
        </h2>
        <p className="text-orange-400 mt-2 text-sm">
          From startups to Fortune 500s, our alumni are building the future.
        </p>
      </div>

      {/* Marquee Motion */}
      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex gap-16 w-max items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear",
          }}
        >
          {[...companies, ...companies].map((company, idx) => (
            <div
              key={idx}
              className="text-orange-400 font-semibold text-lg hover:text-orange-300 transition duration-300 whitespace-nowrap"
            >
              {company}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyMarquee;
