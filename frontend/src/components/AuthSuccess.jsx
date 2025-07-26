import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkAuth } from '../authSlice';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || 'problemset';

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        // Force auth check after Google login
        const result = await dispatch(checkAuth());
        
        if (result.payload && result.type === 'auth/checkAuth/fulfilled') {
          console.log('✅ Auth successful, redirecting to:', redirect);
          navigate(`/${redirect}`, { replace: true });
        } else {
          console.log('❌ Auth failed, redirecting to login');
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/login', { replace: true });
      }
    };

    // Small delay to ensure cookies are set
    const timer = setTimeout(handleAuthSuccess, 100);
    return () => clearTimeout(timer);
  }, [dispatch, navigate, redirect]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg">Completing authentication...</p>
        <p className="text-sm text-gray-400 mt-2">Please wait while we log you in</p>
      </div>
    </div>
  );
};

export default AuthSuccess;
