import React, { useEffect } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './authSlice';
import LandingPage from "./pages/LandingPage";
import Signup from './pages/SignUp';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import ProblemPage from './pages/ProblemPage'
import ProblemSolvePage from './pages/ProblemSolvePage';
import Admin from './pages/Admin';
import MyProfile from './pages/MyProfile';
import Problem from './pages/Problem';
import CreateProblem from './components/AdminPanel/CreateProblem';
import { Delete } from 'lucide-react';
import DeleteProblem from './components/AdminPanel/DeleteProblem';
import AdminUpload from './components/AdminPanel/UploadVideo';
import UploadVideo from './components/AdminPanel/UploadVideo';
import AdminVideo from './components/AdminPanel/AdminVideo';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, user, loading,initialCheckComplete  } = useSelector((state) => state.auth);

  // Check authentication on app load
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Show loading spinner only for protected routes
  const protectedRoutes = ['/problemset', '/admin', '/problem'];
  const isProtectedRoute = protectedRoutes.some(route => location.pathname.startsWith(route));
  
  if (!initialCheckComplete && isProtectedRoute) {
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
      <Route path='/myprofile' element={<MyProfile />} />
      <Route path="/problem/:problemId" element={<Problem/>}></Route>
      <Route path="/admin/create" element={isAuthenticated && user?.role  === 'admin' ? <CreateProblem /> : <Navigate to="/" />} />
      <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <DeleteProblem /> : <Navigate to="/" />} />
      <Route path="/admin/video" element={isAuthenticated && user?.role === 'admin' ? <AdminVideo /> : <Navigate to="/" />} />
      <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role === 'admin' ? <UploadVideo /> : <Navigate to="/" />} />
      
      {/* Protected routes */}
      <Route 
        path='/problemset' 
        element={
          initialCheckComplete && isAuthenticated ? 
            <ProblemPage /> : 
            <Navigate to="/login" replace />
        } 
      />
      <Route 
        path='/problem/:id' 
        element={
          initialCheckComplete && isAuthenticated ? 
            <ProblemSolvePage /> : 
            <Navigate to="/login" replace />
        } 
      />
      <Route 
        path='/admin' 
        element={
          initialCheckComplete && isAuthenticated && user?.role === 'admin' ? 
            <Admin /> : 
            <Navigate to="/" replace />
        } 
      />
    </Routes>
  )
}

export default App;