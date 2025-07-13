import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { registerUser, resetAuthError } from "../authSlice";
import { FaGoogle, FaExclamationTriangle, FaCheckCircle, FaUniversity } from "react-icons/fa";
import { Eye, EyeOff, AlertCircle, X } from "lucide-react";

const signupSchema = z
  .object({
    firstName: z.string().min(3, "Name must be at least 3 characters"),
    emailId: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isUserAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  // Reset auth errors when component mounts
  useEffect(() => {
    dispatch(resetAuthError());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({ resolver: zodResolver(signupSchema) });

  const password = watch("password");

  useEffect(() => {
    if (isUserAuthenticated) {
      navigate("/");
    }
  }, [isUserAuthenticated, navigate]);

  // Handle different error types
  const getErrorMessage = (error) => {
    if (!error) return null;
    
    const errorStr = typeof error === 'string' ? error : error.message || JSON.stringify(error);
    
    if (errorStr.toLowerCase().includes('email') && errorStr.toLowerCase().includes('exist')) {
      return {
        type: 'warning',
        title: 'Email Already Registered',
        message: 'An account with this email already exists. Please try another email or log in.',
        action: 'login'
      };
    }
    if (errorStr.toLowerCase().includes('invalid email') || errorStr.toLowerCase().includes('email validation')) {
      return {
        type: 'error',
        title: 'Invalid Email Format',
        message: 'Please enter a valid email address.',
        action: 'retry'
      };
    }
    if (errorStr.toLowerCase().includes('password') && errorStr.toLowerCase().includes('requirement')) {
      return {
        type: 'error',
        title: 'Weak Password',
        message: 'Password must contain at least 8 characters with uppercase, lowercase, and numbers.',
        action: 'retry'
      };
    }
    if (errorStr.toLowerCase().includes('network') || errorStr.toLowerCase().includes('connection')) {
      return {
        type: 'error',
        title: 'Connection Error',
        message: 'Please check your internet connection and try again.',
        action: 'retry'
      };
    }
    if (errorStr.toLowerCase().includes('validation') || errorStr.toLowerCase().includes('invalid')) {
      return {
        type: 'error',
        title: 'Invalid Information',
        message: 'Please check your information and try again.',
        action: 'retry'
      };
    }
    if (errorStr.includes('401')) {
      return {
        type: 'error',
        title: 'Session Expired',
        message: 'Your session has expired. Please try again.',
        action: 'retry'
      };
    }
    
    return {
      type: 'error',
      title: 'Signup Failed',
      message: errorStr || 'An unexpected error occurred. Please try again.',
      action: 'retry'
    };
  };

  const onSubmit = async (data) => {
    setNotification(null);
    dispatch(resetAuthError());
    
    try {
      const result = await dispatch(registerUser(data));
      if (result.type === 'auth/registerUser/fulfilled') {
        setNotification({
          type: 'success',
          title: 'Account Created Successfully!',
          message: 'Welcome to IndieCode! You can now start your coding journey.',
          action: null
        });
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href =
      "http://localhost:3000/user/google?redirect_uri=http://localhost:5173/auth/google/callback";
  };

  const dismissNotification = () => {
    setNotification(null);
    dispatch(resetAuthError());
  };

  const handleRetry = () => {
    setNotification(null);
    dispatch(resetAuthError());
    reset();
  };

  const handleCollegeRedirect = () => {
    dismissNotification();
    navigate("/collegeSignUp");
  };

  const errorInfo = error ? getErrorMessage(error) : null;

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;

    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    
    return {
      strength: (strength / 5) * 100,
      label: labels[strength - 1] || 'Very Weak',
      color: colors[strength - 1] || 'bg-red-500'
    };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-black text-white relative"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dltqzdtfh/image/upload/v1750446385/gridbg_uxjjws.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Notification Toast */}
      {(notification || errorInfo) && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <div className={`p-4 rounded-lg shadow-lg border backdrop-blur-md ${
            (notification?.type || errorInfo?.type) === 'success' 
              ? 'bg-green-900/90 border-green-500/50 text-green-100' 
              : (notification?.type || errorInfo?.type) === 'warning'
              ? 'bg-yellow-900/90 border-yellow-500/50 text-yellow-100'
              : 'bg-red-900/90 border-red-500/50 text-red-100'
          }`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {(notification?.type || errorInfo?.type) === 'success' ? (
                  <FaCheckCircle className="text-green-400 text-xl" />
                ) : (notification?.type || errorInfo?.type) === 'warning' ? (
                  <FaExclamationTriangle className="text-yellow-400 text-xl" />
                ) : (
                  <AlertCircle className="text-red-400 text-xl" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">
                  {notification?.title || errorInfo?.title}
                </h4>
                <p className="text-sm mt-1 opacity-90">
                  {notification?.message || errorInfo?.message}
                </p>
                {(notification?.action || errorInfo?.action) && (
                  <div className="mt-3 flex gap-2">
                    {(notification?.action || errorInfo?.action) === 'login' && (
                      <button
                        onClick={() => {
                          dismissNotification();
                          navigate('/login');
                        }}
                        className="text-xs px-3 py-1 bg-white/20 hover:bg-white/30 rounded transition-colors"
                      >
                        Go to Login
                      </button>
                    )}
                    {(notification?.action || errorInfo?.action) === 'retry' && (
                      <button
                        onClick={handleRetry}
                        className="text-xs px-3 py-1 bg-white/20 hover:bg-white/30 rounded transition-colors"
                      >
                        Try Again
                      </button>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={dismissNotification}
                className="flex-shrink-0 text-white/60 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] p-8 relative overflow-hidden">
        <div
          className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(0, 0, 0, 0.19), rgba(133, 133, 133, 0.19), rgba(222, 222, 222, 0.19))",
          }}
        ></div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="relative mb-8">
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

          {/* Google Signup Button */}
          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaGoogle className="text-xl" />
            <span>Sign up with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-white/20"></div>
            <span className="flex-shrink mx-4 text-white/60 text-sm">OR</span>
            <div className="flex-grow border-t border-white/20"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* First Name */}
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-medium text-white">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="John"
                autoComplete="given-name"
                className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                  errors.firstName ? "border-red-500 focus:ring-red-500" : "border-white/10"
                }`}
                {...register("firstName")}
              />
              {errors.firstName && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={16} />
                  <span>{errors.firstName.message}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="emailId" className="block text-sm font-medium text-white">
                Email Address
              </label>
              <input
                id="emailId"
                type="email"
                placeholder="john@example.com"
                autoComplete="email"
                className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                  errors.emailId ? "border-red-500 focus:ring-red-500" : "border-white/10"
                }`}
                {...register("emailId")}
              />
              {errors.emailId && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={16} />
                  <span>{errors.emailId.message}</span>
                </div>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 pr-12 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.password ? "border-red-500 focus:ring-red-500" : "border-white/10"
                  }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-white/60">{passwordStrength.label}</span>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={16} />
                  <span>{errors.password.message}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 pr-12 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "border-white/10"
                  }`}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={16} />
                  <span>{errors.confirmPassword.message}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg shadow-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:shadow-orange-500/25"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Navigation Options */}
          <div className="mt-6 space-y-3">
            {/* Existing Account */}
            <div className="text-center">
              <span className="text-sm text-white/60">
                Already have an account?{" "}
                <NavLink 
                  to="/login" 
                  className="text-orange-400 hover:text-orange-300 transition-colors font-medium"
                  onClick={() => dispatch(resetAuthError())}
                >
                  Sign in
                </NavLink>
              </span>
            </div>
            
            {/* College Signup Option */}
            <div className="text-center">
              <button
                onClick={handleCollegeRedirect}
                className="flex items-center justify-center gap-2 text-sm text-orange-400 hover:text-orange-300 transition-colors font-medium"
              >
                <FaUniversity className="text-orange-400" />
                <span>Are you a college? Sign up here</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;