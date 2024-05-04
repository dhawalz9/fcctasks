import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import About from "./pages/About";
import SignupWithEmail from "./pages/SignupWithEmail";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/signup-email" element={<SignupWithEmail/>}/>
        <Route path="/signin" element={<Login/>}/>
        <Route path="/dashboard" element={<UserDashboard/>}/>
        <Route path="/about" element={<About/>} />
        <Route path="*" element={<><h1>404 Not Found</h1><Link to='/'>Go to home</Link></>} />
      </Routes>

    </>
  );
}

export default App;
