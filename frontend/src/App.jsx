import { Routes,Route, Navigate } from "react-router"
import HomePage from "./pages/Homepage"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import { checkAuth } from "./authSlice"
import { useDispatch,useSelector } from "react-redux"
import { useEffect } from "react"
import AdminPanel from "./pages/AdminPanel"

function App() {

  //code likhna pdega isAuthenticated or not
  const {isAuthenticated,loading}=useSelector((state)=>state.auth);
  const dispatch=useDispatch();
  useEffect(()=>{
    dispatch(checkAuth());
  },[dispatch])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={isAuthenticated?<HomePage></HomePage>:<Navigate to='/signup'/>}></Route>
        <Route path="/login" element={isAuthenticated?<Navigate to='/'/>:<Login></Login>}></Route>
        <Route path="/signup" element={isAuthenticated?<Navigate to='/'/>:<Signup></Signup>}></Route>
        <Route path="/admin" element={<AdminPanel></AdminPanel>}></Route>
      </Routes>
    </>
  )
}

export default App
