import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import { registerUser } from '../authSlice';
import { FaGoogle } from 'react-icons/fa';
import { Eye, EyeOff, Code, Zap, Trophy, Target, Star, Rocket, Brain, Shield, Users, BookOpen } from 'lucide-react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';

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
  const animationRef = useRef(null);

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

  useEffect(() => {
    // Animate floating icons
    const icons = animationRef.current?.querySelectorAll('.floating-icon');
    if (icons) {
      gsap.set(icons, { opacity: 0, scale: 0 });
      
      gsap.to(icons, {
        opacity: 0.6,
        scale: 1,
        duration: 1,
        stagger: 0.2,
        ease: "back.out(1.7)"
      });

      // Continuous floating animation
      icons.forEach((icon, index) => {
        gsap.to(icon, {
          y: -20,
          rotation: 10,
          duration: 3 + index * 0.5,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut"
        });
      });
    }

    // Animate feature cards
    const featureCards = animationRef.current?.querySelectorAll('.feature-card');
    if (featureCards) {
      featureCards.forEach((card, index) => {
        gsap.fromTo(card, 
          { opacity: 0, y: 50 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 1, 
            delay: index * 0.2,
            ease: "power3.out"
          }
        );
      });
    }

    // Animate progress bars
    const progressBars = animationRef.current?.querySelectorAll('.progress-bar');
    if (progressBars) {
      progressBars.forEach((bar, index) => {
        gsap.fromTo(bar, 
          { width: '0%' },
          { 
            width: '100%', 
            duration: 2, 
            delay: 1 + index * 0.3,
            ease: "power2.out"
          }
        );
      });
    }
  }, []);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:3000/user/google?redirect_uri=http://localhost:5173/auth/google/callback';
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/dltqzdtfh/image/upload/v1750446385/gridbg_uxjjws.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-3 mb-4"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Code className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold">
                <span className="text-white">Indie</span>
                <span className="text-orange-500">Code</span>
              </span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold text-white mb-2"
            >
              Join IndieCode
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-400"
            >
              Start your coding journey today
            </motion.p>
          </div>

          {/* Google Signup Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white text-black rounded-xl font-medium hover:bg-gray-100 transition-all duration-300 mb-6 group"
          >
            <FaGoogle className="text-xl group-hover:scale-110 transition-transform" />
            <span>Continue with Google</span>
          </motion.button>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="relative flex items-center py-4"
          >
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-4 bg-red-900/30 border border-red-700/50 rounded-xl text-red-300 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* First Name */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-2"
            >
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                autoComplete="given-name"
                className={`w-full px-4 py-3 bg-gray-900/50 border ${
                  errors.firstName ? 'border-red-500' : 'border-gray-700'
                } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300`}
                {...register('firstName')}
              />
              {errors.firstName && (
                <p className="text-red-400 text-sm">{errors.firstName.message}</p>
              )}
            </motion.div>

            {/* Email */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="space-y-2"
            >
              <label htmlFor="emailId" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <input
                id="emailId"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                className={`w-full px-4 py-3 bg-gray-900/50 border ${
                  errors.emailId ? 'border-red-500' : 'border-gray-700'
                } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300`}
                {...register('emailId')}
              />
              {errors.emailId && (
                <p className="text-red-400 text-sm">{errors.emailId.message}</p>
              )}
            </motion.div>

            {/* Password */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="space-y-2"
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 pr-12 bg-gray-900/50 border ${
                    errors.password ? 'border-red-500' : 'border-gray-700'
                  } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300`}
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm">{errors.password.message}</p>
              )}
            </motion.div>

            {/* Confirm Password */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="space-y-2"
            >
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 pr-12 bg-gray-900/50 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                  } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300`}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm">{errors.confirmPassword.message}</p>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          {/* Terms */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="text-xs text-gray-500 text-center mt-4"
          >
            By creating an account, you agree to our{' '}
            <a href="#" className="text-orange-400 hover:text-orange-300">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-orange-400 hover:text-orange-300">Privacy Policy</a>
          </motion.p>

          {/* Login Link */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="text-center mt-6"
          >
            <span className="text-gray-400">Already have an account? </span>
            <NavLink to="/login" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
              Sign in
            </NavLink>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Animation */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-orange-900/20 to-orange-800/20 relative overflow-hidden">
        <div 
          ref={animationRef}
          className="w-full h-full flex items-center justify-center relative"
        >
          {/* Background Pattern */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url('https://res.cloudinary.com/dltqzdtfh/image/upload/v1750446385/gridbg_uxjjws.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {/* Floating Icons */}
          <div className="absolute inset-0">
            <Code className="floating-icon absolute top-16 left-16 w-10 h-10 text-blue-400" />
            <Trophy className="floating-icon absolute top-32 right-24 w-8 h-8 text-yellow-400" />
            <Zap className="floating-icon absolute bottom-48 left-12 w-12 h-12 text-purple-400" />
            <Target className="floating-icon absolute bottom-24 right-16 w-10 h-10 text-green-400" />
            <Star className="floating-icon absolute top-48 left-1/4 w-6 h-6 text-orange-400" />
            <Rocket className="floating-icon absolute bottom-64 right-1/4 w-8 h-8 text-pink-400" />
            <Brain className="floating-icon absolute top-64 right-12 w-10 h-10 text-cyan-400" />
            <Shield className="floating-icon absolute bottom-32 left-1/3 w-8 h-8 text-emerald-400" />
            <Users className="floating-icon absolute top-80 left-20 w-9 h-9 text-indigo-400" />
            <BookOpen className="floating-icon absolute bottom-80 right-20 w-9 h-9 text-teal-400" />
          </div>

          {/* Feature Cards */}
          <div className="relative z-10 max-w-md space-y-6">
            <div className="feature-card bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Interactive Learning</h3>
                  <p className="text-gray-400 text-sm">Real-time code execution</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white">85%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="progress-bar bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="feature-card bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">AI-Powered Hints</h3>
                  <p className="text-gray-400 text-sm">Smart learning assistance</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Accuracy</span>
                  <span className="text-white">92%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="progress-bar bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="feature-card bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Community</h3>
                  <p className="text-gray-400 text-sm">50K+ active developers</p>
                </div>
              </div>
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full border-2 border-gray-900 flex items-center justify-center text-white text-xs font-bold">
                    {i}
                  </div>
                ))}
                <div className="w-8 h-8 bg-gray-700 rounded-full border-2 border-gray-900 flex items-center justify-center text-gray-300 text-xs">
                  +
                </div>
              </div>
            </div>
          </div>

          {/* Central Glow Effect */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-full blur-3xl"></div>

          {/* Animated Text */}
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="text-2xl font-bold text-white mb-2"
            >
              Start Your Journey
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 1 }}
              className="text-gray-300 text-sm max-w-xs"
            >
              Join our community and unlock your coding potential
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;