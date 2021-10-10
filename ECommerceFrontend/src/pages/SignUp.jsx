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
  const [userAlreadyRegistered,setUserAlreadyRegistered] = useState(false);


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
      }
      else if(response.data.status === 'failed' &&
      response.data.msg==='User already registered'){
        setUserAlreadyRegistered(true)
      }
      else{
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
          <div className="col-md-6 mt-4 offset-3">        
            <form 
              style={{ 
                border: "1px solid gray  ", 
                padding: "5%", 
                boxShadow:"5px 5px 10px gray", 
                marginTop:"5%",
                backgroundColor:"white"
              }}
            >
              <h3 className="text-black text-center mb-4">Looks, Like you are new Here!!</h3>
              <div className="form-group">
                <input 
                  className="form-control"
                  placeholder="Full Name"
                  onChange={validateName} 
                  value={name}
                  id="input1"
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
                  onChange={validateEmail} 
                  value={email}
                  id="input1"  
                />
              </div>
              {
                errorMessageEmail ? 
                <><span className="text-danger">Enter Valide Email</span><br/></>:
                null
              }
              <div className="form-row">
                  <div className="form-group col-md-6">
                      <input 
                        className="form-control" 
                        placeholder="Contact Number"
                        onChange={validateContact} 
                        value={contact}
                        id="input1"  
                      />
                  </div>
                  <div className="form-group col-md-6">
                    <input 
                      className="form-control" 
                      placeholder="Create Password"
                      onChange={validatePassword} 
                      value={password} 
                      id="input1" 
                    />
                  </div>
              </div>
              {
                errorMessageContact ? 
                <><span className="text-danger" style={{float:'left'}}>Enter Valide Contact No</span></>:
                null
              }

              {
                errorMessagePassword ? 
                <><span className="text-danger" style={{float:'right'}}>Enter Valide Password</span><br/></>:
                null
              }
              <div className="form-group">
                <textarea 
                  className="form-control" 
                  placeholder="Enter Address Details"
                  onChange={validateAddress} 
                  value={address}
                  id="input1" 
                />
              </div>
              {
                errorMessageAddress ?  
                <><span className="text-danger">Enter Valid Address</span><br/></>:
                null
              }
              {
                successMessage ?  
                <div className="text-center">
                <><span className="text-success">Sign Up Successful!!
                <u className="text-primary" onClick={handleLogin}> Login?</u></span><br/></>
                </div>
                :null
              }
              {
                userAlreadyRegistered ?
                <div className="text-center">
                <><span className="text-danger">Email or Contact already Registered
                </span><br/></>
                </div>
                :null
              }
              <button 
                type="button"
                className="btn btn-block btn-primary" 
                style={{padding:"2% 8%", float:"right"}}
                disabled={!(email && password && name && contact && address &&
                !errorMessageEmail && !errorMessagePassword && !errorMessageName 
                && !errorMessageAddress && !errorMessageContact
                )} 
                onClick={signUpSubmit}
              >
                Signup
              </button>
              <div className="text-center">
              <button 
                type="button"
                className="btn btn-link"
                onClick={handleLogin}
              >
                Existing User? Log in 
              </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
export default SignUp;
