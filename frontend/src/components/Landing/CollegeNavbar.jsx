import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, NavLink } from 'react-router-dom';
import { logoutCollege} from '../../authSlice';

const CollegeNavbar = () => {
  const dispatch = useDispatch();
  const { isCollegeAuthenticated, college, loading } = useSelector((state) => state.auth);

  if (loading) {
    return null;
  }
  const handleLogout = () => {
    dispatch(logoutCollege());
    Navigate('/college'); 
  };

  // Active link style handler
  const getActiveStyle = ({ isActive }) => ({
    color: isActive ? '#ffa500' : 'white',
    fontWeight: isActive ? 600 : 'normal'
  });

  return (
    <div
      className="w-full px-4 md:px-12 py-3 border-2 border-white text-white rounded-none md:rounded-full bg-opacity-20"
      style={{
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.19), rgba(133, 133, 133, 0.19), rgba(222, 222, 222, 0.19))',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="text-xl font-bold">
          <NavLink 
            to="/" 
            className="hover:text-gray-300 transition"
          >
            DooCode
          </NavLink>
        </div>

        <div className="flex space-x-6">
          <NavLink  to='/college'  end
          style={getActiveStyle}>
              College
          </NavLink>
          <NavLink to={isCollegeAuthenticated?'/college/students':'/collegeSignup'} 
          style={getActiveStyle}>
            Students
          </NavLink>
          <NavLink to='/*' 
          style={getActiveStyle}>
            Assign Task
          </NavLink>

          <NavLink to={isCollegeAuthenticated?'/college/managestudents':'/collegeSignup'}
          style={getActiveStyle} >
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
                  {college?.collegeName?.charAt(0)?.toUpperCase() || 'U'}
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

                {college?.role === 'admin' && (
                  <li>
                    <NavLink 
                      to="/admin"
                      className={({ isActive }) => 
                        isActive ? 'text-[#ffa500] font-medium' : ''
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