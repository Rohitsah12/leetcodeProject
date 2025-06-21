import React, { useEffect } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './authSlice';
import LandingPage from "./pages/LandingPage";
import Signup from './pages/SignUp';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import HomePage from './pages/HomePage';
import Admin from './pages/Admin';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  // Check authentication on app load
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Show loading spinner only for protected routes
  const protectedRoutes = ['/problemset', '/admin', '/explore'];
  const isProtectedRoute = protectedRoutes.includes(location.pathname);
  
  if (loading && isProtectedRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path='/' element={<LandingPage />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
      <Route path='*' element={<PageNotFound />} />
      
      {/* Protected routes */}
      <Route 
        path='/problemset' 
        element={isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path='/admin' 
        element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" replace />} 
      />
    </Routes>
  )
}

export default App;