import { useEffect, useState } from "react";
import CustomNavbar from "../components/Navbar";
import "../styles/authpages.css";
import Footer from "../components/Footer";
import { useFirebase } from "../context/firebaseAuth";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const firebase = useFirebase();
  console.log(firebase);
  const navigate = useNavigate();

  const activeButton="patient";
  const [emailPh, setEmailPh] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    if (firebase.isLoggedin) {
      navigate("/");
    } else {
      console.log("User is not logged in");
    }
  }, [firebase.isLoggedin]);

  const handleEmailPh = (e) => {
    const input = e.target.value;
    setEmailPh(input);
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^[0-9]{10}$/;

    if (emailRegex.test(input)) {
      console.log("You entered an email");
    } else if (phoneRegex.test(input)) {
      console.log("You entered a phone number");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^[0-9]{10}$/;

    if (emailRegex.test(emailPh)) {
      console.log("You are loging up with email");
      const result = await firebase.signinUserWithEmailAndPassword(
        emailPh,
        password
      );
      if (result === "auth/user-not-found") {
        setError("User not found\nPlease signup first");
      }
      if (result === "auth/wrong-password") {
        setError("Wrong password");
      }
      if (result === "auth/too-many-requests") {
        setError("Too many requests\nPlease try again later");
      }
      console.log(result);
    } else if (phoneRegex.test(emailPh)) {
      if (activeButton === "doctor") {
        const dummyEmail = "+91" + emailPh + "@dummyemailfordoc.com";
        const result = await firebase.signinUserWithEmailAndPassword(
          dummyEmail,
          password
        );
        if (result === "auth/user-not-found") {
          setError("User not found\nPlease signup first");
        }
        if (result === "auth/wrong-password") {
          setError("Wrong password");
        }
        if (result === "auth/too-many-requests") {
          setError("Too many requests\nPlease try again later");
        }
        console.log(result);
      } else {
        const dummyEmail = "+91" + emailPh + "@dummyemailforauth.com";
        const result = await firebase.signinUserWithEmailAndPassword(
          dummyEmail,
          password
        );
        if (result === "auth/user-not-found") {
          setError("User not found\nPlease signup first");
        }
        if (result === "auth/wrong-password") {
          setError("Wrong password");
        }
        if (result === "auth/too-many-requests") {
          setError("Too many requests\nPlease try again later");
        }
        console.log(result);
      }
    } else {
      setError("Please enter a valid email or phone number(10 digit)");
    }
  };

  return (
    <div>
      <CustomNavbar />

      <div className="signup-card">
        <div className="signup-container">
          <h1>Login(if already a user)</h1>

          <form className="signup" onSubmit={handleSubmit}>
            <input
              type="text"
              onChange={handleEmailPh}
              placeholder="Email/Phone number"
            />
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Password"
            />
            <p
              style={{
                color: "red",
                textAlign: "center",
                fontSize: "1.2rem",
              }}
            >
              {error}
            </p>
            <button type="submit">Login</button>
          </form>
          <p>
            New User? <Link to={"/signup"}>Signup</Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
