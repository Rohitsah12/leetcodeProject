import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import { loginUser } from '../authSlice';
import { FaGoogle,  } from 'react-icons/fa';
import { Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak"),
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  
  const { 
    isUserAuthenticated, 
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
    if (isUserAuthenticated ) {
      navigate('/');
    }
  }, [isUserAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/user/google';
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          
          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors mb-6"
          >
            <FaGoogle className="text-xl" />
            <span>Sign in with Google</span>
          </button>
          
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-white/20"></div>
            <span className="flex-shrink mx-4 text-white/60 text-sm">OR</span>
            <div className="flex-grow border-t border-white/20"></div>
          </div>

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

            {/* Password with Toggle */}
            <div className="form-control mt-4">
              <label htmlFor="password" className="label">
                <span className="label-text text-white">Password</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`input input-bordered w-full bg-transparent text-white placeholder-gray-400 focus:ring-2 focus:ring-primary transition-all duration-200 pr-10 ${
                    errors.password ? 'input-error' : ''
                  }`}
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-white transition-colors"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.password && (
                <span className="text-error text-sm mt-1">{errors.password.message}</span>
              )}
            </div>

            {/* Error from Backend */}
            {error && (
              <div className="text-error text-sm text-center mt-4">
                {typeof error === 'string' ? error : 'Login failed. Please try again.'}
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
              <NavLink to="/signup" className="link link-primary">
                Sign Up
              </NavLink>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;