import { Routes,Route } from "react-router"
import HomePage from "./pages/Homepage"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage></HomePage>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/signup" element={<Signup></Signup>}></Route>
      </Routes>
    </>
  )
}

export default App
