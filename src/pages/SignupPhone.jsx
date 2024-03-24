// import React, { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import "../styles/authpages.css";
// import Footer from "../components/Footer";
// import { useFirebase } from "../context/firebaseAuth";
// import { Link, useNavigate } from "react-router-dom";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// const SignupPhone = () => {
//   const firebase = useFirebase();
//   // console.log(firebase);

//   const [number, setNumber] = useState("");
//   const [user,setUser] = useState(null);
//   const [otp, setOtp] = useState("");

//   const navigate = useNavigate();

//   const getOtp = async (e) => {
//     e.preventDefault();
//     try {
//       const confirmation = await firebase.sendOtp(number);
//       setUser(confirmation);
//       console.log(confirmation);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const verifyOtp = async (e) => {
//     e.preventDefault();
//     try {
//       const data = await firebase.otpVerification(otp);
//       console.log(data);
//     } catch (error) {
//       console.log(error);
//     }
//     // try {
//     //   const data = await user.confirm(otp);
//     //   console.log(data);
//     //   console.log("OTP verified");
//     //   console.log(firebase.user);
//     //   console.log(user);
//     // }
//     // catch (error) {
//     //   console.log(error);
//     // }
//   };

//   useEffect(() => {
//     if (firebase.isLoggedin) {
//       console.log(firebase);
//       // navigate("/dashboard");
//     } else {
//       console.log("User is not logged in");
//     }
//   }, [firebase.isLoggedin]);

//   useEffect(() => {
//     if (firebase.userDetails) {
//       console.log(firebase.userDetails);
//     }
//   }, [firebase.userDetails]);

//   useEffect(() => {
//     console.log(number);
//   }, [number]);

//   return (
//     <div>
//       <Navbar />

//       <div className="signup-card">
//         <div className="signup-container">
//           <h1>Signup with phone</h1>

//           <form
//             className="signup"
//             onSubmit={getOtp}
//           >
//             <PhoneInput
//               country={"in"}
//               value={number}
//               onChange={(number)=>setNumber("+"+number)}
//               placeholder="Enter phone number"
//               specialLabel=""
//             />
//             <div id="recaptcha"></div>
//             <div className="button-right">
//               <Link to="/">
//                 <button variant="secondary">Cancel</button>
//               </Link>
//               &nbsp;
//               <button type="submit" variant="primary">
//                 Send Otp
//               </button>
//             </div>
//           </form>

//           <form
//             onSubmit={verifyOtp}
//             className="signup"
//           >
//             <input
//               type="otp"
//               placeholder="Enter OTP"
//               onChange={(e) => setOtp(e.target.value)}
//             />
//             <div className="button-right">
//               <Link to="/">
//                 <button type="button">Cancel</button>
//               </Link>
//               &nbsp;
//               <button type="submit">Verify</button>
//             </div>
//           </form>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default SignupPhone;
