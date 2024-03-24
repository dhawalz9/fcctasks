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
} from "firebase/auth";
import {getFirestore, collection, addDoc } from 'firebase/firestore'

const FirebaseContext = createContext(null);

export const useFirebase = () => {
  return useContext(FirebaseContext);
};

const firebaseConfig = {
  apiKey: "AIzaSyDTgak8YGYdtN0rHJezSZjURfFyaujOcM4",
  authDomain: "kaustubhamedtech-9cc39.firebaseapp.com",
  projectId: "kaustubhamedtech-9cc39",
  storageBucket: "kaustubhamedtech-9cc39.appspot.com",
  messagingSenderId: "829842970757",
  appId: "1:829842970757:web:56cc2e9d69ccd04f0ef1ec",
  measurementId: "G-PH4B8LBQXP",
};

const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);
const firestore = getFirestore(app);
firebaseAuth.useDeviceLanguage();


export const FirebaseProvider = (props) => {

  // user includes - all the user details provided by firebase
  const [user, setUser] = useState(null);

  // userDetails includes - email, emailVerified, phoneNumber
  const [userDetails, setUserDetails] = useState(null);
  
  // phoneVerified - true if the user has verified the phone number or if the user has a dummy email
  const [phoneVerified, setPhoneVerified] = useState(false);


  const [confirmationResult, setConfirmationResult] = useState(null);
  const [haveAltEmail, setHaveAltEmail] = useState(false);

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

  useEffect(() => {
    if (user) {
      // Update userDetails here
      const isDummyEmail = user?.email?.endsWith('@dummyemailforauth.com');
      
      setUserDetails({
        email: user.email,
        emailVerified: isDummyEmail ? true : user.emailVerified,
        phoneNumber: isDummyEmail ? user?.email?.replace('@dummyemailforauth.com', '') : user?.phoneNumber,
        isDummy: isDummyEmail ? true : false,
      });
      if(isDummyEmail){
        setPhoneVerified(true);
      }
    } else {
      setUserDetails(null);
    }
  }, [user]);


  // Auth functions
  const signinUserWithEmailAndPassword = async (email, password) => {
    try {
      
      const isDummyEmail = email.endsWith('@dummyemailforauth.com');
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
        phoneNumber: isDummyEmail ? user?.email?.replace('@dummyemailforauth.com', '') : user.phoneNumber,
        isDummy: isDummyEmail ? true : false,
        phoneVerified: isDummyEmail ? true : false,
      });

      if(user.emailVerified === false && !isDummyEmail){
        await sendEmailVerification(user);
        console.log("Email sent")
      }
      return user;
    } catch (error) {
      return error;
    }
  };

  const signupUserAndVerification = async (email, password, backupPhone) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      )
      const userDatainDB = await addDoc(collection(firestore, 'users'), {
        userId: userCredential.user?.uid,
        signupEmail: userCredential.user?.email,
        signupPhone: backupPhone,
      });
      console.log(userDatainDB);
      console.log(userCredential)
      setUserDetails({
        email: userCredential.user.email,
        emailVerified: userCredential.user.emailVerified,
      });
      const user = userCredential.user;
      await sendEmailVerification(user);
      console.log("Email sent")
      return user;
    } catch (error) {
      return error;
    }
  };

  const logout = async () => {
    try {
      await signOut(firebaseAuth);
      console.log("Logged out");
      console.log(user);
    } catch (error) {
      return error;
    }
  }


  const sendOtp = async (number) => {
    try {
      const recaptcha = new RecaptchaVerifier(firebaseAuth, "recaptcha", {});
      const confirmation = await signInWithPhoneNumber(firebaseAuth, number, recaptcha);
      setConfirmationResult(confirmation);
      return confirmation; 
    } catch (error) {
      return error;
    }
  }

  const otpVerification = async (otp,password,phone) => {
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
        emailVerified:true,
        email:dummyEmail,
        phoneNumber:phone,
      })
      console.log(dummyUserCredential);
      console.log(data);
      console.log("OTP verified");
      // const userDatainDB = await addDoc(collection(firestore, 'users'), {
      //   userId: data.user?.uid,
      //   signupPhone: data.user?.phoneNumber,
      //   signupEmail: backupEmail,
      // });
      // console.log(userDatainDB);
      setUser(data.user);
      console.log(user);
      return data;
    }
    catch (error) {
      return error;
    }
  }



  const handleCreateUserData = async (name, age, gender, address, phone, altEmail) => {
    try {
      const doc = await addDoc(collection(firestore, 'users'), {
        name: name,
        alternate_email: altEmail,
        age: age,
        gender: gender,
        address: address,
        phone: phone,
        userId: user.uid,
        userEmail: user.email,
        displayName: user.displayName,
      });
      console.log("Document stored successfully");
      return doc;
    } catch (error) {
      console.log(error);
    }
  };


  const makeAltEmail=async(email)=>{
    
    setHaveAltEmail(true);
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
        userDetails,
        isLoggedin,
        user,
        phoneVerified,
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};
