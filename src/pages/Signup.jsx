import { useEffect, useState } from "react";
import CustomNavbar from "../components/Navbar";
import "../styles/authpages.css";
import Footer from "../components/Footer";
import { useFirebase } from "../context/firebaseAuth";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";

const Signup = () => {

  const firebase = useFirebase();
  const navigate = useNavigate();

  // states
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [sendOtp, setSendOtp] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [passworderror, setPasswordError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [emailPh, setEmailPh] = useState("");
  const [user, setUser] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const activeButton="patient";

  // navigate to dashboard if user is already logged in
  useEffect(() => {
    if (firebase.isLoggedin) {
      navigate("/dashboard");
    } else {
      console.log("User is not logged in");
    }
  }, [firebase.isLoggedin, navigate]);

  const getOtp = async (e) => {
    e.preventDefault();

    //error handling
    if(password !== confirmPassword){
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

    // check if the inupt phone number is valid
    const phoneRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;

    if (phoneRegex.test(emailPh)){
      try {
        const confirmation = await firebase.sendOtp(emailPh);
        setIsPhone(true);
        setSendOtp(true);
        setUser(confirmation);
        console.log(confirmation);
        console.log("OTP sent");
      } catch (error) {
        console.log(error);
      }
    } else {
      setPasswordError("Invalid phone number");
      return;
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (user) {
      try {
        const data = await firebase.otpVerification(otp,password,emailPh,activeButton);
        console.log(data);
        if(data.code === 'auth/invalid-verification-code'){
          console.log("Invalid OTP");
          setOtpError("The OTP is not correct");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("User not found");
    }
  };

  // useEffect(() => {
  //   if (firebase.userDetails) {
  //     console.log(firebase.userDetails);
  //   }
  // }, [firebase.userDetails]);

  return (
    <div>
      <CustomNavbar />

      <div className="signup-card overlay-form">

        <div className="signup-container">

          <h1>Signup</h1>
          
          {!isPhone && (
            <>
              <form onSubmit={getOtp} className="signup">

                <PhoneInput
                  country={"in"}
                  onChange={number => setEmailPh("+" + number)}
                  placeholder="Phone number"
                  specialLabel=""
                  required
                />

                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="Password"
                />
                <input
                  type="password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  placeholder="Confirm Password"
                />
                {passworderror && <p style={{color:'red'}}>{passworderror}</p>}
                <button type="submit">Verify</button>
              </form>

              <div id="recaptcha"></div>
            </>
          )}

          {isPhone && (
            <>
              {sendOtp && (
                <form onSubmit={verifyOtp} className="signup">
                  <input
                    type="text"
                    maxLength="6"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    placeholder="Enter OTP"
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  {otpError && <p style={{color:'red'}}>{otpError}</p>}
                  <button type="submit">Verify OTP</button>
                </form>
              )}
            </>
          )}

          <p className="user-already">
            Already a user <Link to="/signin">Login</Link>
          </p>
          <br />

          <p className="email-signup-btn">
            Signup using <Link to="/signup-email">Email</Link>
          </p>
          <br />

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Signup;
