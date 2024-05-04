import { useEffect, useState } from "react";
import CustomNavbar from "../components/Navbar";
import Footer from "../components/Footer";
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

  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");

  const [error, setError] = useState("");

  const firebase = useFirebase();
  console.log(firebase)
  const navigate = useNavigate();
  useEffect(() => {
    if (!firebase.isLoggedin) {
      navigate("/signup");
    }
    if(firebase?.userDetails?.isDoc){
      navigate("/docdashboard");
    }
  }, [firebase.isLoggedin]);

  const handleSubmit = async(e) => {
    e.preventDefault();
    const userCreated = await firebase.handleCreateUserData(name, age, gender, address, phone, altemail);
    console.log(userCreated);
  }

  const handleChangePass = async()=>{
    if(password.length<6){
      setError("password should be atleast 6 characters long");
      return;
    }
    else{
      setError("");
    }
    if(password === cpassword){
      const passChanged = await firebase.changePassword(password);
      console.log(passChanged);
      alert("password changed successfully");
      window.location.reload();
    }
    else{
      setError("passwords do not match");
      return;
    }
  }


  return (
    <>
      <CustomNavbar />
      <div className="dashboard">
        <h1>Dashboard</h1>
        {((firebase?.userDetails && firebase?.userDetails?.emailVerified)||firebase?.user?.phoneNumber)?(
          
          <div className="layout-side">
            <div className="left-side">
              <br />
              <h2>Welcome {firebase?.userDetails?.email}</h2>
              <br />
              <h2>
                {firebase.isDoctor && "Loged-in as Doctor"}
              </h2>
              {/* <h3>email has been verified</h3> */}
              <br />

              <div>
                <button type="button" className="btn mb-3" data-bs-toggle="modal" data-bs-target="#exampleModal" style={{backgroundColor:'rgb(48, 113, 255)', color:'white'}}>
                  Change Password
                </button>
                {/* Modal */}
                <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Enter new password</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                      </div>
                      <div className="modal-body">
                        <div style={{ marginBottom: '10px' }}>
                          <input onChange={(e)=>{setPassword(e.target.value);}} type="password" id="password" name="password" placeholder="New Password" style={{ borderRadius: '5px',border:'none', backgroundColor:'rgb(251, 241, 241)',padding:'5px' }} />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                          <input onChange={(e)=>{setCpassword(e.target.value);}} type="password" id="cpassword" name="cpassword" placeholder="Confirm new Password" style={{ borderRadius: '5px',border:'none',backgroundColor:'rgb(251, 241, 241)',padding:'5px' }}/>
                        </div>
                      </div>
                      <p style={{color:'red'}}>{error}</p>
                      <div className="modal-footer">
                        <button type="button" className="btn" style={{backgroundColor:'rgb(48, 113, 255)', color:'white'}} data-bs-dismiss="modal">Close</button>
                        <button type="button" onClick={handleChangePass} className="btn" style={{backgroundColor:'rgb(48, 113, 255)', color:'white'}}>Save changes</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <button onClick={firebase.logout} className="logout-btn">Logout</button>
            </div>

            <div className="right-side">
              {!firebase?.isUserDataCreated && 
                <>
                  <form className="info-form" onSubmit={handleSubmit}>
                  <h3 className="details-heading">Fill the details</h3>
                    <label htmlFor="name">Name:</label>
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
                </>
              }
            </div>



            
          </div>
        ):(
          <h2>please verify the email</h2>
        )}
      </div>




      <Footer />
    </>
  );
};

export default UserDashboard;
