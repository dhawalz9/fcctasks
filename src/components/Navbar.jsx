import React from 'react'
import '../styles/navbar.css'
import { useFirebase } from '../context/firebaseAuth'
import { Link } from 'react-router-dom';

const Navbar = () => {

  const firebase = useFirebase();


  return (
    <div>
      <header className="App-header">
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            {firebase.isLoggedin && <li><a href="/dashboard">Dashboard</a></li>}
            <li><a href="/contact">Contact</a></li>
            {/* <li className="login"><a href="/signup">Login</a></li> */}
            {!firebase.isLoggedin && <li className='login'><Link to="/signin">Login</Link></li>}
          </ul>
        </nav>
      </header>
    </div>
  )
}

export default Navbar
