import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import { collegeRegister } from '../authSlice';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import Navbar from '../components/Landing/Navbar';

// Updated schema to include confirmPassword
const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum character should be 3"),
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

function CollegeSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isCollegeAuthenticated, loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (isCollegeAuthenticated) {
      navigate('/college');
    }
  }, [isCollegeAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(collegeRegister(data));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-black text-white"
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
            background:
              'linear-gradient(135deg, rgba(0, 0, 0, 0.19), rgba(133, 133, 133, 0.19), rgba(222, 222, 222, 0.19))',
          }}
        ></div>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-center text-white mb-6 tracking-wide">
            DooCode
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* First Name */}
            <div className="form-control">
              <label htmlFor="firstName" className="label">
                <span className="label-text text-white">First Name</span>
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="John"
                autoComplete="given-name"
                className={`input input-bordered w-full bg-transparent text-white placeholder-gray-400 focus:ring-2 focus:ring-primary transition-all duration-200 ${
                  errors.firstName ? 'input-error' : '' 
                }`}
                {...register('firstName')}
              />
              {errors.firstName && (
                <span className="text-error text-sm mt-1">{errors.firstName.message}</span>
              )}
            </div>

            {/* Email */}
            <div className="form-control mt-4">
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
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`input input-bordered w-full pr-10 bg-transparent text-white placeholder-gray-400 focus:ring-2 focus:ring-primary transition-all duration-200 ${
                    errors.password ? 'input-error' : ''
                  }`}
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <span className="text-error text-sm mt-1">{errors.password.message}</span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-control mt-4">
              <label htmlFor="confirmPassword" className="label">
                <span className="label-text text-white">Confirm Password</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`input input-bordered w-full pr-10 bg-transparent text-white placeholder-gray-400 focus:ring-2 focus:ring-primary transition-all duration-200 ${
                    errors.confirmPassword ? 'input-error' : ''
                  }`}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-error text-sm mt-1">{errors.confirmPassword.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-control mt-8 flex justify-center">
              <button
                type="submit"
                className={`btn text-black bg-white ${
                  loading ? 'loading' : ''
                }`}
                disabled={loading}
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </div>
          </form>

          {/* Navigation to Login */}
          <div className="text-center mt-6">
            <span className="text-sm">
              Already have an account?{' '}
              <NavLink to="/collegeLogin" className="link link-primary">
                Login
              </NavLink>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollegeSignup;