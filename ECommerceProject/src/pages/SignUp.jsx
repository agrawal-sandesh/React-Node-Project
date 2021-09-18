import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import '../index.css';
import { useCookies } from 'react-cookie';

const SignUp =()=>{
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [errorMessageName, setErrorMessageName] = useState(false);
  const [errorMessageEmail, setErrorMessageEmail] = useState(false);
  const [errorMessageContact, setErrorMessageContact] = useState(false);
  const [errorMessagePassword, setErrorMessagePassword] = useState(false);
  const [errorMessageAddress, setErrorMessageAddress] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [cookies, setCookie] = useCookies(['PMartSecrete']);


  const validateName = (event)=>{
    setName(event.target.value);
    setErrorMessageName(!(event.target.value.length > 1))
  }
  
  const validateEmail = (event)=>{
    setEmail(event.target.value);
    setErrorMessageEmail(!(event.target.value.includes('@')))
  }

  const validateContact = (event)=>{
    setContact(event.target.value);
    setErrorMessageContact(!(event.target.value.length == 10))
  }

  const validatePassword = (event)=>{
    setPassword(event.target.value);
    setErrorMessagePassword(!(event.target.value.length > 5))
  }

  const validateAddress = (event)=>{
    setAddress(event.target.value);
    setErrorMessageAddress(!(event.target.value.length > 10))
  }

  const handleLogin=()=>{
    history.push('/login');
  }


  const signUpSubmit = ()=>{
    axios
    .post('http://localhost:4000/signup', {
      name: name,
      email: email,
      contact:contact,
      password: password,
      address:address
    })
    .then(response=> {
      if(response.data.status === 'success'){
        setName('');
        setEmail('');
        setContact('');
        setPassword('');
        setAddress('');
        setSuccessMessage(true)
      }else{
        alert('SignUp Failed')
      }
    })
    .catch(function (error) {
      alert(error.message);
    });
  }
    
  return (
    <React.Fragment>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-5 offset-3">        
            <form 
              style={{ 
                border: "1px solid gray  ", 
                padding: "50px", 
                borderRadius: "8px", 
                boxShadow:"5px 5px 10px gray", 
                marginTop:"5%",
                backgroundColor:"#F5F5F5"
              }}
            >
              <h2 className="text-black text-center mb-4">SignUp Form</h2>
              <div className="form-group">
                <input 
                  className="form-control"
                  placeholder="Full Name"
                  style={{backgroundColor:"#F5FFFA"}} 
                  onChange={validateName} 
                  value={name} 
                />
              </div>
              {
                errorMessageName ? 
                <><span className="text-danger">Enter Valid Name</span><br/></>:
                null
              }
              <div className="form-group">
                <input 
                  className="form-control" 
                  placeholder="Email Address"
                  style={{backgroundColor:"#F5FFFA"}} 
                  onChange={validateEmail} 
                  value={email} 
                />
              </div>
              {
                errorMessageEmail ? 
                <><span className="text-danger">Enter Valide Email</span><br/></>:
                null
              }
              <div className="form-group">
                  <input 
                    className="form-control" 
                    placeholder="Contact Number"
                    style={{backgroundColor:"#F5FFFA"}} 
                    onChange={validateContact} 
                    value={contact} 
                  />
              </div>
              {
                errorMessageContact ? 
                <><span className="text-danger">Enter Valide Contact No</span><br/></>:
                null
              }
              <div className="form-group">
                  <input 
                    className="form-control" 
                    placeholder="Create Password"
                    style={{backgroundColor:"#F5FFFA"}} 
                    onChange={validatePassword} 
                    value={password} 
                  />
              </div>
              {
                errorMessagePassword ? 
                <><span className="text-danger">Enter Valide Password</span><br/></>:
                null
              }
              <div className="form-group">
                <textarea 
                  className="form-control" 
                  placeholder="Enter Address Details"
                  style={{backgroundColor:"#F5FFFA"}} 
                  onChange={validateAddress} 
                  value={address}
                />
              </div>
              {
                errorMessageAddress ?  
                <><span className="text-danger">Enter Valid Address</span><br/></>:
                null
              }
              <button 
                type="button"
                className="btn btn-primary" 
                style={{padding:"2% 8%", float:"right"}}
                disabled={!(email && password && name && contact && address &&
                !errorMessageEmail && !errorMessagePassword && !errorMessageName 
                && !errorMessageAddress && !errorMessageContact
                )} 
                onClick={signUpSubmit}
              >
                SignUp
              </button>
              {
                successMessage ?  
                <><span className="text-success">Sign Up Successful!!
                <u className="text-primary" onClick={handleLogin}> Login?</u></span><br/></>:
                null
              }
            </form>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
export default SignUp;
