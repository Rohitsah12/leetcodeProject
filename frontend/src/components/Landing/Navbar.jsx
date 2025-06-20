import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { logoutUser } from '../../authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return null; // Don't show navbar while loading
  }

  return (
    <div
      className="w-full px-4 md:px-12 py-3 border-2 border-white text-white rounded-none md:rounded-full bg-opacity-20"
      style={{
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.19), rgba(133, 133, 133, 0.19), rgba(222, 222, 222, 0.19))',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="text-xl font-bold">
          <NavLink to="/">DooCode</NavLink>
        </div>

        <div className="flex space-x-6">
          <NavLink 
            to={isAuthenticated ? '/problemset' : '/signup'}
            className="hover:text-gray-300 transition"
          >
            Problem
          </NavLink>
        </div>

        <div className="flex space-x-4 items-center">
          {!isAuthenticated ? (
            <NavLink to="/signup">
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
                  {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm">{user?.firstName}</span>
              </div>

              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu dropdown-content bg-white/10 backdrop-blur border border-white/10 rounded-box w-52 text-white"
              >
                <li>
                  <button onClick={() => dispatch(logoutUser())}>Sign out</button>
                </li>
                {user?.role === 'admin' && (
                  <li>
                    <NavLink to="/admin">Admin Panel</NavLink>
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

export default Navbar;