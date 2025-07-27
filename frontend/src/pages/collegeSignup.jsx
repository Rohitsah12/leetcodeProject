import React, { useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { FaBuilding, FaEnvelope, FaPhone, FaArrowRight, FaCode } from 'react-icons/fa';

function CollegeSignup() {
  const navigate = useNavigate();

  // Redirect to login after showing the message
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/collegeLogin');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-black text-white relative"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dltqzdtfh/image/upload/v1750446385/gridbg_uxjjws.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-lg bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] p-8 relative overflow-hidden">
        <div
          className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(0, 0, 0, 0.19), rgba(133, 133, 133, 0.19), rgba(222, 222, 222, 0.19))",
          }}
        ></div>

        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="relative mb-8">
            <NavLink
              to="/"
              className="group flex items-center space-x-2 hover:scale-105 transition-all duration-300 ease-out justify-center"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300">
                  <div className="text-white font-bold text-lg">
                    <span className="block transform group-hover:rotate-12 transition-transform duration-300">
                      &lt;/&gt;
                    </span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              </div>

              <div className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-orange-200 group-hover:to-white transition-all duration-300">
                  Indie
                </span>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent group-hover:from-orange-400 group-hover:to-orange-300 transition-all duration-300">
                  Code
                </span>
              </div>
            </NavLink>
          </div>

          {/* College Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaBuilding className="text-white text-3xl" />
          </div>

          <h2 className="text-3xl font-bold text-orange-400 mb-6">
            College Registration
          </h2>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              🎓 For College Administrators
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              To maintain quality and ensure proper integration, we provide college login credentials directly. 
              Our team will help you set up your institution's coding culture management system.
            </p>
            
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3 text-gray-300">
                <FaEnvelope className="text-orange-400 flex-shrink-0" />
                <span>Email us at: <strong className="text-white">support@indiecode.com</strong></span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <FaPhone className="text-orange-400 flex-shrink-0" />
                <span>Call us at: <strong className="text-white">+91 XXXXX XXXXX</strong></span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <NavLink 
              to="/collegeLogin"
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 hover:shadow-orange-500/25"
            >
              <FaBuilding />
              Go to College Login
              <FaArrowRight />
            </NavLink>

            <div className="text-center">
              <span className="text-sm text-white/60">
                Are you a fluent coder?{" "}
                <NavLink 
                  to="/signup" 
                  className="text-orange-400 hover:text-orange-300 transition-colors font-medium inline-flex items-center gap-1"
                >
                  <FaCode />
                  Sign up here
                </NavLink>
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-6">
            Redirecting to login page in a few seconds...
          </p>
        </div>
      </div>
    </div>
  );
}

export default CollegeSignup;
