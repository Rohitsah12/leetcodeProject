import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, NavLink } from "react-router-dom";
import { logoutCollege } from "../../authSlice";

const CollegeNavbar = () => {
  const dispatch = useDispatch();
  const { isCollegeAuthenticated, college, loading } = useSelector(
    (state) => state.auth
  );

  if (loading) {
    return null;
  }
  const handleLogout = () => {
    dispatch(logoutCollege());
    Navigate("/college");
  };

  // Active link style handler
  const getActiveStyle = ({ isActive }) => ({
    color: isActive ? "#ffa500" : "white",
    fontWeight: isActive ? 600 : "normal",
  });

  return (
    <div
      className="w-full px-4 md:px-12 py-3 border-2 border-white text-white rounded-none md:rounded-full bg-opacity-20"
      style={{
        background:
          "linear-gradient(135deg, rgba(0, 0, 0, 0.19), rgba(133, 133, 133, 0.19), rgba(222, 222, 222, 0.19))",
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="relative">
          <NavLink
            to="/"
            className="group flex items-center space-x-2 hover:scale-105 transition-all duration-300 ease-out"
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

            <div className="absolute -bottom-1 left-12 h-0.5 w-0 bg-gradient-to-r from-orange-500 to-orange-400 group-hover:w-[120px] transition-all duration-300 ease-out"></div>
          </NavLink>
        </div>

        <div className="flex space-x-6">
          <NavLink to="/college" end style={getActiveStyle}>
            College
          </NavLink>
          <NavLink
            to={isCollegeAuthenticated ? "/college/students" : "/collegeSignup"}
            style={getActiveStyle}
          >
            Students
          </NavLink>
          <NavLink to="/*" style={getActiveStyle}>
            Assign Task
          </NavLink>

          <NavLink
            to={
              isCollegeAuthenticated
                ? "/college/managestudents"
                : "/collegeSignup"
            }
            style={getActiveStyle}
          >
            Manage Students
          </NavLink>
        </div>

        <div className="flex space-x-4 items-center">
          {!isCollegeAuthenticated ? (
            <NavLink to="/collegeSignup">
              <span className="cursor-pointer text-black border border-gray-300 rounded-full px-4 py-2 bg-white hover:scale-105 transition duration-300 shadow-md">
                Signup
              </span>
            </NavLink>
          ) : (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                className="btn btn-ghost px-2 flex items-center gap-2 hover:bg-white/10 rounded-full transition"
              >
                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm border border-white">
                  {college?.collegeName?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="text-sm">{college?.collegeName}</span>
              </div>

              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu dropdown-content bg-white/10 backdrop-blur border border-white/10 rounded-box w-52 text-white"
              >
                <li>
                  <button onClick={handleLogout}>Sign out</button>
                </li>

                {college?.role === "admin" && (
                  <li>
                    <NavLink
                      to="/admin"
                      className={({ isActive }) =>
                        isActive ? "text-[#ffa500] font-medium" : ""
                      }
                    >
                      Admin Panel
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollegeNavbar;
