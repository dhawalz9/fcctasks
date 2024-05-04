import React from 'react'
import '../styles/navbar.css'
import logo from "../assests/images/fcclogo.png";

const Footer = () => {
  return (
    <div>
      <footer className="App-footer">
            <div className="logo-box"><img src={logo} alt="logo"/></div>
            <h3>Finance and Consulting Club</h3>
      </footer>
    </div>
  )
}

export default Footer
