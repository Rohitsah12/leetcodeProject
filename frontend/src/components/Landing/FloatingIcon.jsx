// src/components/FloatingIcons.jsx (Orbital Version)
import React from "react";
import { motion } from "framer-motion";
import {
  FaJava,
  FaPython,
} from "react-icons/fa";
import {
  SiJavascript,
  SiTypescript,
  SiRubyonrails,
  SiPhp,
  SiCplusplus,
  SiGo,
  SiRust,
} from "react-icons/si";

const icons = [
  { icon: <SiCplusplus size={80} className="text-blue-700" />, x: "10%", y: "10%", radius: 25 },
  { icon: <SiJavascript size={80} className="text-yellow-400" />, x: "45%", y: "5%", radius: 35 },
  { icon: <SiRust size={80} className="text-orange-700" />, x: "70%", y: "7%", radius: 20 },
  { icon: <SiGo size={80} className="text-cyan-500" />, x: "85%", y: "20%", radius: 40 },
  { icon: <FaPython size={80} className="text-blue-500" />, x: "75%", y: "40%", radius: 30 },
  { icon: <SiTypescript size={80} className="text-blue-400" />, x: "90%", y: "65%", radius: 25 },
  { icon: <SiPhp size={80} className="text-indigo-500" />, x: "60%", y: "75%", radius: 35 },
  { icon: <SiRubyonrails size={80} className="text-red-600" />, x: "20%", y: "60%", radius: 28 },
  { icon: <FaJava size={80} className="text-red-500" />, x: "10%", y: "85%", radius: 32 },
];

const FloatingIcons = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {icons.map((item, idx) => (
        <motion.div
          key={idx}
          className="absolute"
          initial={{
            top: "50%",
            left: "50%",
            scale: 0,
            opacity: 0,
          }}
          animate={{
            top: item.y,
            left: item.x,
            scale: 1,
            opacity: 0.8,
          }}
          transition={{
            type: "spring",
            damping: 15,
            stiffness: 100,
            delay: idx * 0.2,
            duration: 2,
          }}
          style={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 10 + idx * 2, // Different speeds for each icon
              repeat: Infinity,
              delay: 2 + idx * 0.3,
              ease: "linear",
            }}
          >
            <motion.div
              style={{
                position: "relative",
                left: item.radius,
              }}
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3 + idx * 0.5,
                repeat: Infinity,
                delay: idx * 0.2,
                ease: "easeInOut"
              }}
              whileHover={{
                scale: 1.5,
                transition: { duration: 0.3 }
              }}
            >
              <motion.div
                animate={{
                  rotate: [0, -360], // Counter-rotate to keep icon upright
                }}
                transition={{
                  duration: 10 + idx * 2,
                  repeat: Infinity,
                  delay: 2 + idx * 0.3,
                  ease: "linear",
                }}
              >
                {item.icon}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingIcons;
