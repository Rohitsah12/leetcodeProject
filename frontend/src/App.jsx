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
import DeleteProblem from './components/AdminPanel/DeleteProblem';
import UploadVideo from './components/AdminPanel/UploadVideo';
import AdminVideo from './components/AdminPanel/AdminVideo';
import UpdateProblemList from './components/AdminPanel/UpdateProblemList';
import UpdateProblem from './components/AdminPanel/UpdateProblem';
import CollegeLanding from './pages/CollegeLanding';
import Collegelogin from './pages/collegeLogin';
import CollegeSignup from './pages/collegeSignup';
import GoogleCallback from './components/GoogleCallback';
import ManageStudent from './pages/ManageStudent';
import AddStudent from './components/ManageStudents/AddStudent';
import DeleteStudent from './components/ManageStudents/DeleteStudent';
import UpdateStudent from './components/ManageStudents/UpdateStudent';
import Students from './pages/Students';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  
  const { 
    isUserAuthenticated,
    isCollegeAuthenticated,
    user,
    userCheckComplete,
    collegeCheckComplete
  } = useSelector((state) => state.auth);

  // Check authentication on app load
  useEffect(() => {
    dispatch(checkAuth());
    dispatch(checkCollegeAuth());
  }, [dispatch]);

  // Show loading spinner for protected routes
  const protectedUserRoutes = ['/problemset', '/admin', '/problem'];
  const protectedCollegeRoutes = ['/college/managestudents','/college/students'];
  
  const isProtectedUserRoute = protectedUserRoutes.some(route => location.pathname.startsWith(route));
  const isProtectedCollegeRoute = protectedCollegeRoutes.some(route => location.pathname.startsWith(route));
  
  const authChecksComplete = userCheckComplete && collegeCheckComplete;
  
  // Show loading for user protected routes when user auth check is not complete
  if (!userCheckComplete && isProtectedUserRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Show loading for college protected routes when college auth check is not complete
  if (!collegeCheckComplete && isProtectedCollegeRoute) {
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
      <Route path='/myprofile/:id' element={<MyProfile />} />
      <Route path="/problem/:problemId" element={<Problem/>}></Route>
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      <Route path='/college' element={<CollegeLanding />}/>
      
      {/* User Protected routes */}
      <Route 
        path='/problemset' 
        element={
          isUserAuthenticated ? 
            <ProblemPage /> : 
            <Navigate to="/login" replace />
        } 
      />
      <Route 
        path='/problem/:id' 
        element={
          isUserAuthenticated ? 
            <ProblemSolvePage /> : 
            <Navigate to="/login" replace />
        } 
      />
      <Route 
        path='/admin' 
        element={
          isUserAuthenticated && user?.role === 'admin' ? 
            <Admin /> : 
            <Navigate to="/" replace />
        } 
      />
      <Route 
        path="/admin/create" 
        element={
          isUserAuthenticated && user?.role === 'admin' ? 
            <CreateProblem /> : 
            <Navigate to="/" replace />
        } 
      />
      <Route 
        path="/admin/delete" 
        element={
          isUserAuthenticated && user?.role === 'admin' ? 
            <DeleteProblem /> : 
            <Navigate to="/" replace />
        } 
      />
      <Route 
        path="/admin/video" 
        element={
          isUserAuthenticated && user?.role === 'admin' ? 
            <AdminVideo /> : 
            <Navigate to="/" replace />
        } 
      />
      <Route 
        path="/admin/upload/:problemId" 
        element={
          isUserAuthenticated && user?.role === 'admin' ? 
            <UploadVideo /> : 
            <Navigate to="/" replace />
        } 
      />
      <Route 
        path="/admin/update" 
        element={
          isUserAuthenticated && user?.role === 'admin' ? 
            <UpdateProblemList /> : 
            <Navigate to="/" replace />
        } 
      />
      <Route 
        path="/admin/update/:problemId" 
        element={
          isUserAuthenticated && user?.role === 'admin' ? 
            <UpdateProblem /> : 
            <Navigate to="/" replace />
        } 
      />

      {/* College Protected routes */}
      <Route 
        path='/college/managestudents' 
        element={
          isCollegeAuthenticated ? 
            <ManageStudent /> : 
            <Navigate to='/collegeLogin' replace />
        } 
      />
      <Route 
        path='/college/managestudents/add' 
        element={
          isCollegeAuthenticated ? 
            <AddStudent /> : 
            <Navigate to='/collegeLogin' replace />
        } 
      />
      <Route 
        path='/college/managestudents/delete' 
        element={
          isCollegeAuthenticated ? 
            <DeleteStudent /> : 
            <Navigate to='/collegeLogin' replace />
        } 
      />
      <Route 
        path='/college/managestudents/update' 
        element={
          isCollegeAuthenticated ? 
            <UpdateStudent /> : 
            <Navigate to='/collegeLogin' replace />
        } 
      />
      <Route 
        path='/college/students' 
        element={
          isCollegeAuthenticated ? 
            <Students /> : 
            <Navigate to='/collegeLogin' replace />
        } 
      />
    </Routes>
  )
}

export default App;