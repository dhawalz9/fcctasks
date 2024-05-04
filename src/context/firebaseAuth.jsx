// File for Firebase Authentication and Firestore context provider and hook functions

import { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updatePassword,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  where,
  query,
  updateDoc,
} from "firebase/firestore";

const FirebaseContext = createContext(null);

export const useFirebase = () => {
  return useContext(FirebaseContext);
};

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBe6lL68rqI0X3qH6DdMLmXKIn8I98L3FU",
  authDomain: "fccreact.firebaseapp.com",
  projectId: "fccreact",
  storageBucket: "fccreact.appspot.com",
  messagingSenderId: "842920396433",
  appId: "1:842920396433:web:ee6a7798b434bdfd3e2130",
  measurementId: "G-QYSL2SFMTP"
};

const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);
const firestore = getFirestore(app);
firebaseAuth.useDeviceLanguage();

export const FirebaseProvider = (props) => {
  // user includes - all the user details provided by firebase
  const [user, setUser] = useState(null);

  // userDetails includes - email, emailVerified, phoneNumber, isDummy, phoneVerified
  const [userDetails, setUserDetails] = useState(null);

  // phoneVerified - true if the user has verified the phone number or if the user has a dummy email
  const [phoneVerified, setPhoneVerified] = useState(false);

  const [confirmationResult, setConfirmationResult] = useState(null);
  // const [haveAltEmail, setHaveAltEmail] = useState(false);

  // Initialize isUserDataCreated from localStorage
  const [isUserDataCreated, setIsUserDataCreated] = useState(
    localStorage.getItem("isUserDataCreated") === "true"
  );

  // useEffect to check if the user is logged in or not and update the user state 
  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        setUser(user);
        setUserDetails({
          email: user.email,
          emailVerified: user.emailVerified,
          // add other details you want to track
        });
        console.log(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  // useEffect to update userDetails when user state changes
  useEffect(() => {
    if (user) {
      // Update userDetails here
      const isDummyEmail = user?.email?.endsWith("@dummyemailforauth.com");

      setUserDetails({
        email: user.email,
        emailVerified: isDummyEmail ? true : user.emailVerified,
        phoneNumber: isDummyEmail ? user?.email?.replace("@dummyemailforauth.com", "") : user?.phoneNumber,
        isDummy: isDummyEmail ? true : false,
        phoneVerified: isDummyEmail ? true : false,
      });
      if (isDummyEmail) {
        setPhoneVerified(true);
      }
    } else {
      setUserDetails(null);
    }
  }, [user]);

  // Auth functions

  // Signin function
  const signinUserWithEmailAndPassword = async (email, password) => {
    try {
      const isDummyEmail = email.endsWith("@dummyemailforauth.com");
      const userCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const user = userCredential.user;

      console.log(userCredential);
      console.log(user);
      console.log(userDetails);

      setUser(user);
      setUserDetails({
        email: user.email,
        emailVerified: isDummyEmail ? true : user.emailVerified,
        phoneNumber: isDummyEmail
          ? user?.email?.replace("@dummyemailforauth.com", "")
          : user.phoneNumber,
        isDummy: isDummyEmail ? true : false,
        phoneVerified: isDummyEmail ? true : false,
      });

      if (user.emailVerified === false && !isDummyEmail) {
        await sendEmailVerification(user);
        console.log("Email sent");
      }
      return user;
    } catch (error) {
      return error;
    }
  };

  // Signup function
  const signupUserAndVerification = async (email, password, backupPhone) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const userDatainDB = await addDoc(collection(firestore, "users"), {
        userId: userCredential.user?.uid,
        signupEmail: userCredential.user?.email,
        signupPhone: backupPhone,
      });
      console.log(userDatainDB);
      console.log(userCredential);
      setUserDetails({
        email: userCredential.user.email,
        emailVerified: userCredential.user.emailVerified,
        phoneNumber: backupPhone,
        isDummy: false,
        phoneVerified: false,
      });
      const user = userCredential.user;
      await sendEmailVerification(user);
      console.log("Email sent");
      return user;
    } catch (error) {
      return error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(firebaseAuth);
      console.log("Logged out");
      console.log(user);
    } catch (error) {
      return error;
    }
  };

  // OTP verification functions
  const sendOtp = async (number) => {
    try {
      const recaptcha = new RecaptchaVerifier(firebaseAuth, "recaptcha", {});
      const confirmation = await signInWithPhoneNumber(
        firebaseAuth,
        number,
        recaptcha
      );
      setConfirmationResult(confirmation);
      return confirmation;
    } catch (error) {
      return error;
    }
  };

  const otpVerification = async (otp, password, phone, activeUser) => {
    try {
      const data = await confirmationResult.confirm(otp);

      const dummyEmail = phone + "@dummyemailforauth.com";
      const dummyUserCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        dummyEmail,
        password
      );
      setPhoneVerified(true);
      setUserDetails({
        emailVerified: true,
        email: dummyEmail,
        phoneNumber: phone,
        isDummy: true,
        phoneVerified: true,
      });
      console.log(dummyUserCredential);
      console.log(data);
      console.log("OTP verified");
      const userDatainDB = await addDoc(collection(firestore, "users"), {
        userId: dummyUserCredential.user?.uid,
        signupPhone: phone,
      });
      console.log(userDatainDB);
      setUser(data.user);
      console.log(user);
      return data;
    } catch (error) {
      return error;
    }
  };

  // Firestore functions for user data creation
  const handleCreateUserData = async (
    name,
    age,
    gender,
    address,
    phone,
    altEmail
  ) => {
    try {
      // Create a reference to the users collection
      const usersCollection = collection(firestore, "users");

      // Create a query against the collection
      const q = query(
        usersCollection,
        where("signupPhone", "==", userDetails?.phoneNumber)
      );

      // Execute the query
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const d = querySnapshot.docs[0];

        const doc = await updateDoc(d.ref, {
          name: name,
          alternate_email: altEmail,
          age: age,
          gender: gender,
          address: address,
          altphone: phone,
          userId: user.uid,
          userEmail: user.email,
          displayName: user.displayName,
        });
        console.log("Document updated successfully");
        setIsUserDataCreated(true);
        localStorage.setItem("isUserDataCreated", true);
        return doc;
      }
    } catch (error) {
      console.log(error);
    }
  };



  // function to get all the previous appointments of the user
  const getUsersPrevAppoints = async () => {
    const appointmentCollection = collection(firestore, "appointment");
    const q = query(appointmentCollection, where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const appoints = querySnapshot.docs.map((doc) => doc.data());
    return appoints;
  };


  const changePassword = async (newPassword) => {
    try {
      const updatePass = await updatePassword(user, newPassword);
      console.log(updatePass);
      return updatePass;
    }
    catch (error) {
      return error;
    }
  }


  const isLoggedin = user ? true : false;

  return (
    <FirebaseContext.Provider
      value={{
        signinUserWithEmailAndPassword,
        signupUserAndVerification,
        otpVerification,
        sendOtp,
        handleCreateUserData,
        logout,
        getUsersPrevAppoints,
        changePassword,
        userDetails,
        isLoggedin,
        user,
        phoneVerified,
        isUserDataCreated,
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};
