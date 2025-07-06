import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import { registerUser } from '../authSlice';
import { FaGoogle } from 'react-icons/fa';
import { Eye, EyeOff } from 'lucide-react';

const signupSchema = z.object({
  firstName: z.string().min(3, "Name must be at least 3 characters"),
  emailId: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isUserAuthenticated, loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ resolver: zodResolver(signupSchema) });

  const password = watch('password');

  useEffect(() => {
    if (isUserAuthenticated) {
      navigate('/');
    }
  }, [isUserAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:3000/user/google?redirect_uri=http://localhost:5173/auth/google/callback';
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

          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors mb-6"
          >
            <FaGoogle className="text-xl" />
            <span>Sign up with Google</span>
          </button>
          
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-white/20"></div>
            <span className="flex-shrink mx-4 text-white/60 text-sm">OR</span>
            <div className="flex-grow border-t border-white/20"></div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
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
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-error text-sm mt-1">{errors.password.message}</span>
              )}
            </div>

            {/* Confirm Password Field */}
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
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                className={`btn text-black bg-white w-full ${
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
              <NavLink to="/login" className="link link-primary">
                Login
              </NavLink>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;