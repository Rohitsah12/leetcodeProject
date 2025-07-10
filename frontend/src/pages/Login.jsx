import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import { loginUser } from '../authSlice';
import { FaGoogle } from 'react-icons/fa';
import { Eye, EyeOff, Code, Zap, Trophy, Target, Star, Rocket, Brain, Shield } from 'lucide-react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak"),
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const animationRef = useRef(null);
  
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

    // Animate code blocks
    const codeBlocks = animationRef.current?.querySelectorAll('.code-block');
    if (codeBlocks) {
      codeBlocks.forEach((block, index) => {
        gsap.fromTo(block, 
          { opacity: 0, x: 100 },
          { 
            opacity: 0.8, 
            x: 0, 
            duration: 1.5, 
            delay: index * 0.3,
            ease: "power3.out"
          }
        );
      });
    }
  }, []);

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
    <div className="min-h-screen bg-black flex">
      {/* Left Side - Login Form */}
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
              Welcome Back
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-400"
            >
              Sign in to continue your coding journey
            </motion.p>
          </div>

          {/* Google Login Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={handleGoogleLogin}
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
              {typeof error === 'string' ? error : 'Login failed. Please try again.'}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
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
              transition={{ delay: 0.9 }}
              className="space-y-2"
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`w-full px-4 py-3 pr-12 bg-gray-900/50 border ${
                    errors.password ? 'border-red-500' : 'border-gray-700'
                  } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300`}
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm">{errors.password.message}</p>
              )}
            </motion.div>

            {/* Forgot Password */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="text-right"
            >
              <a href="#" className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
                Forgot your password?
              </a>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center mt-8"
          >
            <span className="text-gray-400">Don't have an account? </span>
            <NavLink to="/signup" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
              Sign up
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
            <Code className="floating-icon absolute top-20 left-20 w-12 h-12 text-blue-400" />
            <Trophy className="floating-icon absolute top-40 right-32 w-10 h-10 text-yellow-400" />
            <Zap className="floating-icon absolute bottom-60 left-16 w-14 h-14 text-purple-400" />
            <Target className="floating-icon absolute bottom-32 right-20 w-12 h-12 text-green-400" />
            <Star className="floating-icon absolute top-60 left-1/3 w-8 h-8 text-orange-400" />
            <Rocket className="floating-icon absolute bottom-80 right-1/3 w-10 h-10 text-pink-400" />
            <Brain className="floating-icon absolute top-80 right-16 w-12 h-12 text-cyan-400" />
            <Shield className="floating-icon absolute bottom-40 left-1/4 w-10 h-10 text-emerald-400" />
          </div>

          {/* Code Blocks Animation */}
          <div className="relative z-10 max-w-md">
            <div className="space-y-6">
              <div className="code-block bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="font-mono text-sm text-gray-300">
                  <div className="text-purple-400">function</div>
                  <div className="text-blue-400 ml-2">solveProblem() {`{`}</div>
                  <div className="text-green-400 ml-4">// Your code here</div>
                  <div className="text-orange-400 ml-4">return solution;</div>
                  <div className="text-blue-400 ml-2">{`}`}</div>
                </div>
              </div>

              <div className="code-block bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-semibold">Achievement Unlocked!</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Solved 100+ problems and joined the top 10% of coders!
                </p>
              </div>

              <div className="code-block bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-semibold">Live Contest</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Participants</span>
                    <span className="text-white">2,847</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Time Left</span>
                    <span className="text-orange-400">01:23:45</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Central Glow Effect */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-full blur-3xl"></div>
          </div>

          {/* Animated Text */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="text-3xl font-bold text-white mb-4"
            >
              Code. Compete. Conquer.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 1 }}
              className="text-gray-300 max-w-sm"
            >
              Join thousands of developers mastering algorithms and data structures
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;