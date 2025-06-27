import React from 'react';
import Navbar from '../components/Landing/Navbar';
import { ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const LandingPage = () => {
  const { isUserAuthenticated } = useSelector((state) => state.auth);
  
  return (
    <div
      className="bg-black min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dltqzdtfh/image/upload/v1750446385/gridbg_uxjjws.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Navbar />

      <div className="flex justify-center items-start px-4 pt-20 relative z-10">
        <div className="flex flex-col items-center text-white space-y-6 relative">
          <div className="text-center text-4xl md:text-5xl font-bold leading-tight">
            <h1>Master Coding</h1>
            <h1 className="mt-2">Skills Faster</h1>
          </div>

          {/* Updated navigation */}
          <NavLink to={isUserAuthenticated ? "/problemset" : "/signup"}>
            <button className="flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-full hover:scale-105 transition duration-300 shadow-md">
              {isUserAuthenticated ? "Go to Practice" : "Get Started"} 
              <ArrowRight size={20} />
            </button>
          </NavLink>
        </div>
      </div>

      {/* SVG Arrow */}
      <svg
        className="absolute"
        width="300"
        height="150"
        style={{ top: '33%', left: '50%', transform: 'translateX(-50%)' }}
      >
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#ff6b6b" />
          </marker>
        </defs>
        <path
          d="M 0 60 C 80 20, 200 100, 280 60"
          stroke="#ff6b6b"
          strokeWidth="5"
          fill="none"
          markerEnd="url(#arrowhead)"
        />
      </svg>
    </div>
  );
};

export default LandingPage;
