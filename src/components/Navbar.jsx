import "../styles/navbar.css";
import { useFirebase } from "../context/firebaseAuth";
import { Link } from "react-router-dom";
import logo from "../assests/images/fcclogo.png";

const CustomNavbar = () => {
  const firebase = useFirebase();

  return (
    <nav className="navbar navbar-expand-lg " style={{
      background: "rgb(0,0,0)"}}>      
      <div className="container-fluid">
        <Link className="navbar-brand" to='/'>
          <img src={logo} alt="Logo"  height={50} className="d-inline-block align-text-top" />
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to='/' style={{color: "white"}}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to='/about' style={{color: "white"}}>Contact</Link>
            </li>
            {firebase.isLoggedin && (
              <li className="nav-item">
                <Link className="nav-link" to='/dashboard' style={{color: "white"}}>Dashboard</Link>
              </li>
            )}
            {!firebase.isLoggedin && (
              
              <li className="nav-item">
                <Link className="nav-link" to='/signin' style={{color:"rgb(255, 255, 255)", backgroundColor: "rgb(48, 113, 255)", borderRadius: '5px', maxWidth: '60px'}}>Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default CustomNavbar;
