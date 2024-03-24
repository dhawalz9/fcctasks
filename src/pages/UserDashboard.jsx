import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import watch from "../assests/images/watch.png";
import "../styles/userdashboard.css";
import { useFirebase } from "../context/firebaseAuth";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [altemail, setAltemail] = useState("");

  const firebase = useFirebase();
  console.log(firebase)
  const navigate = useNavigate();
  useEffect(() => {
    if (!firebase.isLoggedin) {
      navigate("/signup");
    }
  }, [firebase.isLoggedin]);

  const handleSubmit = async(e) => {
    e.preventDefault();
    const userCreated = await firebase.handleCreateUserData(name, age, gender, address, phone, altemail);
    console.log(userCreated);
  }

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <h1>Dashboard</h1>
        {((firebase?.userDetails && firebase?.userDetails?.emailVerified)||firebase?.user?.phoneNumber)?(
          
          <>
            <br />
            <h2>Welcome {firebase?.userDetails?.email}</h2>
            <br />
            <h3>email has been verified</h3>
            <br />
            <h2>Devies used -</h2>
            <div className="devices">
              <h2 className="devices-name">smart-watch</h2>
              <img src={watch} alt="watch" className="devices-img"/>
            </div>

            <h3 className="details-heading">Fill the details</h3>
            <form className="info-form" onSubmit={handleSubmit}>
              <label htmlFor="name">First Name:</label>
              <input type="text" id="name" name="name" onChange={(e)=>{
                setName(e.target.value);
              }} />
              <label htmlFor="name">Last Name:</label>
              <input type="text" id="name" name="name" onChange={(e)=>{
                setName(e.target.value);
              }} />

              <label htmlFor="altemail">Alternate Email</label>
              <input type="email" id="altemail" name="altemail" onChange={(e)=>{
                setAltemail(e.target.value);
              }} />

              <label htmlFor="age">Age:</label>
              <input type="number" id="age" name="age" onChange={(e)=>{
                setAge(e.target.value);
              }} />

              <label htmlFor="gender">Gender:</label>
              <select id="gender" name="gender" value={gender} onChange={(e)=>{
                setGender(e.target.value);
              }}>
                <option value="male" defaultChecked>Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <label htmlFor="address">Address:</label>
              <textarea id="address" name="address" onChange={(e)=>{
                setAddress(e.target.value);
              }}></textarea>

              <label htmlFor="phone">Phone Number:</label>
              <input type="tel" id="phone" name="phone" onChange={(e)=>{
                setPhone(e.target.value);
              }} />

              <button type="submit" className="submit-btn">Submit</button>

              {/* Add any additional fields you think are necessary */}
            </form>


            <button onClick={firebase.logout} className="logout-btn">Logout</button>
          </>
        ):(
          <h2>please verify the email</h2>
        )}
      </div>




      <Footer />
    </>
  );
};

export default UserDashboard;
