import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { checkAuth } from '../authSlice';

const GoogleCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        await dispatch(checkAuth()).unwrap();
        navigate('/');
      } catch (error) {
        console.error('Google authentication failed:', error);
        navigate('/login');
      }
    };

    handleGoogleCallback();
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
};

export default GoogleCallback;