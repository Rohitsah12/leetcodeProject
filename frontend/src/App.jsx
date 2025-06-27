import React, { useEffect } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth, checkCollegeAuth } from './authSlice';
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
import UpdateProblemList from './components/AdminPanel/UpdateProblemList';
import UpdateProblem from './components/AdminPanel/UpdateProblem';
import CollegeLanding from './pages/CollegeLanding';
import Collegelogin from './pages/collegeLogin';
import CollegeSignup from './pages/collegeSignup';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isUserAuthenticated,isCollegeAuthenticated,  user, loading,userCheckComplete  } = useSelector((state) => state.auth);

  // Check authentication on app load
  useEffect(() => {
    if(isUserAuthenticated){
      dispatch(checkAuth());  
    }
    else{
      dispatch(checkCollegeAuth());
    }
  }, [dispatch]);



  // Show loading spinner only for protected routes
  const protectedRoutes = ['/problemset', '/admin', '/problem'];
  const isProtectedRoute = protectedRoutes.some(route => location.pathname.startsWith(route));
  
  if (!userCheckComplete && isProtectedRoute) {
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
      <Route path='/collegeLogin' element={<Collegelogin />} />
      <Route path='/collegeSignUp' element={<CollegeSignup />} />
      <Route path='*' element={<PageNotFound />} />
      <Route path='/myprofile' element={<MyProfile />} />
      <Route path="/problem/:problemId" element={<Problem/>}></Route>
      <Route path="/admin/create" element={isUserAuthenticated && user?.role  === 'admin' ? <CreateProblem /> : <Navigate to="/" />} />
      <Route path="/admin/delete" element={isUserAuthenticated && user?.role === 'admin' ? <DeleteProblem /> : <Navigate to="/" />} />
      <Route path="/admin/video" element={isUserAuthenticated && user?.role === 'admin' ? <AdminVideo /> : <Navigate to="/" />} />
      <Route path="/admin/upload/:problemId" element={isUserAuthenticated && user?.role === 'admin' ? <UploadVideo /> : <Navigate to="/" />} />
      <Route path="/admin/update" element={isUserAuthenticated && user?.role === 'admin' ? <UpdateProblemList /> : <Navigate to="/" />} />
      <Route path="/admin/update/:problemId" element={isUserAuthenticated && user?.role === 'admin' ? <UpdateProblem /> : <Navigate to="/" />} />
      <Route path='/college' element={<CollegeLanding />}/>
      
      {/* Protected routes */}
      <Route 
        path='/problemset' 
        element={
          userCheckComplete && isUserAuthenticated ? 
            <ProblemPage /> : 
            <Navigate to="/login" replace />
        } 
      />
      <Route 
        path='/problem/:id' 
        element={
          userCheckComplete && isUserAuthenticated ? 
            <ProblemSolvePage /> : 
            <Navigate to="/login" replace />
        } 
      />
      <Route 
        path='/admin' 
        element={
          userCheckComplete && isUserAuthenticated && user?.role === 'admin' ? 
            <Admin /> : 
            <Navigate to="/" replace />
        } 
      />
    </Routes>
  )
}

export default App;