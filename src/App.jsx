import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import SignupPhone from "./pages/SignupPhone";
import About from "./pages/About";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/signin" element={<Login/>}/>
        <Route path="/dashboard" element={<UserDashboard/>}/>
        <Route path="/about" element={<About/>} />
      </Routes>

    </>
  );
}

export default App;
