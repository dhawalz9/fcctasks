// import React from 'react'
import '../styles/home.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useFirebase } from '../context/firebaseAuth'

const Home = () => {

  const firebase = useFirebase();
  console.log(firebase)

  return (
    <div>
      <Navbar/>
      {/* <header className="App-header">
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li className="login"><a href="/contact">Login</a></li>
          </ul>
        </nav>
      </header> */}

      <main className="App-main">
        <h1>Welcome to KAUSTUBHA MEDTECH</h1>
      {!firebase.isLoggedin && <p>Not signed up. Sign up <a href="/signup">here</a></p>}
      </main>

      {/* <footer className="App-footer">
        <p>© 2024</p>
      </footer> */}
      <Footer/>
    </div>
  )
}

export default Home
