import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import { collegeLogin } from '../authSlice';
import { FaGoogle } from 'react-icons/fa';

const loginSchema = z.object({
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak"),
});

function Collegelogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get both user and college authentication states
  const { 
    isCollegeAuthenticated, 
    loading, 
    error 
  } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  // Navigate if either user or college is authenticated
  useEffect(() => {
    if (isCollegeAuthenticated ) {
      navigate('/college');
    }
  }, [isCollegeAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(collegeLogin(data));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-black"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dltqzdtfh/image/upload/v1750446385/gridbg_uxjjws.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] p-8 relative overflow-hidden">
        <div
          className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none"
          style={{
            background:'linear-gradient(135deg, rgba(0, 0, 0, 0.19), rgba(133, 133, 133, 0.19), rgba(222, 222, 222, 0.19))',
          }}
        ></div>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-center text-white mb-6 tracking-wide">DooCode</h2>
          

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div className="form-control mt-2">
              <label htmlFor="emailId" className="label">
                <span className="label-text text-white">Email</span>
              </label>
              <input
                id="emailId"
                type="email"
                placeholder="john@example.com"
                autoComplete="email"
                className={`input input-bordered w-full bg-transparent text-white placeholder-gray-400 focus:ring-2 focus:ring-primary transition-all duration-200 ${
                  errors.emailId ? 'input-error' : ''
                }`}
                {...register('emailId')}
              />
              {errors.emailId && (
                <span className="text-error text-sm mt-1">{errors.emailId.message}</span>
              )}
            </div>

            {/* Password */}
            <div className="form-control mt-4">
              <label htmlFor="password" className="label">
                <span className="label-text text-white">Password</span>
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className={`input input-bordered w-full bg-transparent text-white placeholder-gray-400 focus:ring-2 focus:ring-primary transition-all duration-200 ${
                  errors.password ? 'input-error' : ''
                }`}
                {...register('password')}
              />
              {errors.password && (
                <span className="text-error text-sm mt-1">{errors.password.message}</span>
              )}
            </div>

            {/* Error from Backend */}
            {error && (
              <div className="text-error text-sm text-center mt-4">
                {typeof error === 'string' ? error : 'Collegelogin failed. Please try again.'}
              </div>
            )}

            {/* Submit Button */}
            <div className="form-control mt-6 flex justify-center">
              <button
                type="submit"
                className={`btn text-black bg-white ${
                  loading ? 'loading' : ''
                }`}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>

          {/* Navigation to Signup */}
          <div className="text-center mt-6">
            <span className="text-sm text-white">
              Don't have an account?{' '}
              <NavLink to="/collegeSignup" className="link link-primary">
                Sign Up
              </NavLink>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Collegelogin;