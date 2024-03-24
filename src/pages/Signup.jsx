import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/authpages.css";
import Footer from "../components/Footer";
import { useFirebase } from "../context/firebaseAuth";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";

const Signup = () => {
  const firebase = useFirebase();
  // console.log(firebase);

  // const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState("");
  // const [otpVerified, setOtpVerified] = useState(false);
  const [sendOtp, setSendOtp] = useState(false);

  // const [isEmail, setIsEmail] = useState(false);
  const [isPhone, setIsPhone] = useState(false);

  // const [backupEmail, setBackupEmail] = useState("");
  // const [backupPhone, setBackupPhone] = useState("");

  const [passworderror, setPasswordError] = useState("");
  const [otpError, setOtpError] = useState("");

  const navigate = useNavigate();

  const [emailPh, setEmailPh] = useState("");
  // console.log(emailPh);
  // const {recaptchaVerifier} = useFirebase();
  const [user, setUser] = useState(null);

  const [confirmPassword, setConfirmPassword] = useState('');

  // const [activeButton, setActiveButton] = useState("patient");
  // const [password, setPassword] = useState("");
  // const [state,setState] = useState({});
  // const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => {
    if (firebase.isLoggedin) {
      navigate("/dashboard");
    } else {
      console.log("User is not logged in");
    }
  }, [firebase.isLoggedin]);

  // const handleEmailPh = (e) => {
  //   e.preventDefault();

  //   // const input = e.target.value;
  //   // setEmailPh(input);
  //   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  //   const phoneRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;

  //   if (emailRegex.test(emailPh)) {
  //     setEmail(emailPh);
  //     setIsEmail(true);
  //   }
  //   else{
  //     console.log("Invalid email");
  //   }

  //   if (phoneRegex.test(emailPh)) {
  //     setPhoneNumber(emailPh);
  //     setIsPhone(true);
  //     // getOtp();
  //   }
  //   else{
  //     console.log("Invalid phone number");
  //   }
  // };

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
    if (phoneRegex.test(emailPh)) {
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
        const data = await firebase.otpVerification(otp,password,emailPh);
        console.log(data);
        if(data.code === 'auth/invalid-verification-code'){
          console.log("Invalid OTP");
          setOtpError("The OTP is not correct");
        }
        // if(data.code === 'auth/email-already-in-use'){
        //   firebase.logout();
        //   navigate("/signin");
        // }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("User not found");
    }
  };

  // const signupAction = async (e) => {
  //   e.preventDefault();
  //   const result = await firebase.signupUserAndVerification(
  //     email,
  //     password,
  //     backupPhone
  //   );
  //   console.log(firebase);
  //   console.log(result);
  // };

  useEffect(() => {
    if (firebase.userDetails) {
      console.log(firebase.userDetails);
    }
  }, [firebase.userDetails]);

  return (
    <div>
      <Navbar />

      <div className="signup-card">
        <div className="signup-container">
          <h1>Signup</h1>
          {!isPhone && (
            <>
              <form onSubmit={getOtp} className="signup">
                <PhoneInput
                  country={"in"}
                  onChange={(number) => {
                    setEmailPh("+" + number);
                    // setBackupPhone("+" + number);
                  }}
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
                {/* <input
                  type="text"
                  onChange={(e) => {
                    setEmailPh(e.target.value)
                    setBackupEmail(e.target.value);
                  }}
                  placeholder="Email"
                  required
                /> */}
                {passworderror && <p style={{color:'red'}}>{passworderror}</p>}
                <button type="submit">Verify</button>
              </form>
              <div id="recaptcha"></div>
            </>
          )}

          {/* {isEmail && (
            <form onSubmit={signupAction} className="signup">
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Password"
              />
              <button type="submit" id="sign-up-button">
                Signup with Email
              </button>
            </form>
          )} */}

          {isPhone && (
            <>
              {/* {!sendOtp && (
              <button onClick={getOtp} className="form-button">Send otp</button>
              )} */}
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

          {/* <form className="signup" onSubmit={}>
            <div className="pat-doc">
              <button
                type="button"
                className={activeButton === "patient" ? "active" : ""}
                onClick={() => setActiveButton("patient")}
              >
                Patient
              </button>
              <button
                type="button"
                className={activeButton === "doctor" ? "active" : ""}
                onClick={() => setActiveButton("doctor")}
              >
                Doctor
              </button>
            </div>

          </form> */}
          <p className="user-already">
            Already a user <Link to="/signin">Signin</Link>
          </p>
          <br />
          <p className="email-signup-btn">
            Signup using <Link to="/signup-email">Email</Link>
          </p>

          {/* {firebase.userDetails?.emailVerified ? <>
            <p>Email verified</p>
          </>:<>
            <p>Email not verified</p>
          </>} */}

          {/* <form className="OTP" onSubmit={onOTPVefify}>
            {showOtpField && (
              <>
                <input
                  type="number"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                />
                <button type="submit">submit otp</button>
              </>
            )}
          </form> */}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Signup;
