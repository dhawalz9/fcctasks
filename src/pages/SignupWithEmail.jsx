import Footer from "../components/Footer";
import CustomNavbar from "../components/Navbar";
import "../styles/authpages.css";
import { useFirebase } from "../context/firebaseAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const SignupWithEmail = () => {
  const firebase = useFirebase();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passworderror, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const activeButton="patient";

  useEffect(() => {
    if (firebase.isLoggedin) {
      navigate("/dashboard");
    } else {
      console.log("User is not logged in");
    }
    if(firebase?.userDetails?.isDoc){
      navigate("/docdashboard");
    }
  }, [firebase.isLoggedin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    else{
      setPasswordError("");
    }

    if(password.length < 6){
      setPasswordError("Password should be atleast 6 characters long");
      return;
    }
    else{
      setPasswordError("");
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (emailRegex.test(email)) {
      console.log("You are signing up with email");
      const result = await firebase.signupUserAndVerification(
        email,
        password,
        null
      );
      console.log(result);
      if (result.code === "auth/email-already-in-use") {
        setPasswordError(
          "Email already in use. Please login or use another email"
        );
      }
    } else {
      setPasswordError("Please enter a valid email");
    }
  };

  return (
    <div>
      <CustomNavbar />
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
            <input
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              placeholder="Confirm Password"
            />
            {passworderror && <p style={{ color: "red" }}>{passworderror}</p>}
            <button type="submit">Verify</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignupWithEmail;
