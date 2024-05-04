// import React from 'react'
import "../styles/home.css";
import CustomNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useFirebase } from "../context/firebaseAuth";
import { useEffect, useRef, useState } from "react";
import bgImg2 from '../assests/images/background.png'


const Typewriter = () => {
  const messages = ["Finance", "Consulting", "Product Management", "Stocks"];
  const [text, setText] = useState(messages[0][0]);
  const currentMessage = useRef(0);
  const currentLetter = useRef(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setText((prevText) => prevText + messages[currentMessage.current][currentLetter.current]);
      currentLetter.current++;
      if (currentLetter.current === messages[currentMessage.current].length) {
        currentLetter.current = 0;
        currentMessage.current = (currentMessage.current + 1) % messages.length;
        setText(messages[currentMessage.current][0]);
      }
    }, 200); // Adjust this value to change the speed of the typewriter effect
    return () => clearInterval(timer);
  }, []);

  return (
    <h1 className="typewrite mb-3">
      <span className="wrap" style={{color: "white"}}>{text}</span>
    </h1>
  );
};


const Home = () => {
  const firebase = useFirebase();

  return (
    <div>
      <CustomNavbar />

      <main className="App-main">

        <section className="hero-wrap">
          <img src={bgImg2} alt="Background" style={{width: '100%', height: '100vh', objectFit: 'cover'}} />
          <div className="container">
            <div className="slider-text">
              <Typewriter />
              <h2 className="mb-7" style={{color: "white"}}>
              The Finance and Consulting Club at IIT Hyderabad is a student-led organization fostering finance and consulting interests. At FCC IITH, students are driven by their passion for finance, consulting, product management and continual progress. Their dedicated team plans a variety of events, such as stimulating lectures, engaging workshops, impactful projects, rigorous competitions, and more, all geared toward achieving their mission of equipping students with useful skills and real-world knowledge in the finance, consulting, and product management domains.
              </h2>
            </div>
          </div>
        </section>



        {!firebase.isLoggedin && (
          <p>
            Not signed up. Sign up <a href="/signup">here</a>
          </p>
        )}
        {firebase?.isLoggedin && !firebase?.userDetails?.isDoc && (
          <>
          </>
        )}
      </main>

      {/* <footer className="App-footer">
        <p>© 2024</p>
      </footer> */}
      <Footer />
    </div>
  );
};

export default Home;
