import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import "../styles/authpages.css"
import { useFirebase } from "../context/firebaseAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


const SignupWithEmail = () => {

  const firebase = useFirebase();

  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passworderror, setPasswordError] = useState("");

  useEffect(() => {
    if (firebase.isLoggedin) {
      navigate("/dashboard");
    } else {
      console.log("User is not logged in");
    }
  }, [firebase.isLoggedin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /\S+@\S+\.\S+/;
    if (emailRegex.test(email)) {
      console.log("You are signing up with email");
      const result = await firebase.signupUserAndVerification(email, password, null);
      console.log(result);
      if(result.code === "auth/email-already-in-use"){
        setPasswordError("Email already in use. Please login or use another email");
      }
    }
    else{
      setPasswordError("Please enter a valid email");
    }
  }

  return (
    <div>
      <Navbar />
      <div className="signup-card">
        <div className="signup-container">
          <h1>Signup</h1>
          <form className="signup" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passworderror && <p style={{color:'red'}} >{passworderror}</p>}
            <button type="submit">Verify</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default SignupWithEmail
