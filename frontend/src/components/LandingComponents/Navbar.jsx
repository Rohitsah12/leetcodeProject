import React from 'react';

const Navbar = () => {
  return (
    <div
      className="w-full px-4 md:px-12 py-3 border-2 rounded-none md:rounded-full bg-opacity-20"
      style={{
        background:
          'linear-gradient(135deg, rgba(0, 0, 0, 0.19), rgba(133, 133, 133, 0.19), rgba(222, 222, 222, 0.19))',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="text-xl font-bold">DooCode</div>

        <div className="flex space-x-6">
          <span className="cursor-pointer hover:text-gray-300 transition">Problem</span>
          <span className="cursor-pointer hover:text-gray-300 transition">Features</span>
        </div>

        <div className="flex space-x-4">
          <span className="cursor-pointer text-black transition border border-gray-300 rounded-full px-4 py-2 bg-white hover:scale-105 transition duration-300 shadow-md">
            Signup
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
