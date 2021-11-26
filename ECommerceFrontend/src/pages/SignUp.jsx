import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import '../index.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope,faEye,faUser,faPhone,faLock,faAddressBook, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Footer from '../components/Footer';
import Image from '../signup.png'

const userIcon = <FontAwesomeIcon icon={faUser} />;
const emailIcon=<FontAwesomeIcon icon={faEnvelope}/>;
const contactIcon = <FontAwesomeIcon icon={faPhone} />;
const passwordIcon=<FontAwesomeIcon icon={faLock}/>;
const addressIcon=<FontAwesomeIcon icon={faAddressBook}/>;
const eye = <FontAwesomeIcon icon={faEye} />;
const eyeSlashIcon=<FontAwesomeIcon icon={faEyeSlash}/>


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
  const [passwordShown, setPasswordShown] = useState(false);


  const validateName = (event)=>{
    setName(event.target.value);
    setErrorMessageName(!(event.target.value.length > 3))
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
    setErrorMessagePassword(!(event.target.value.length >=   6))
  }

  const validateAddress = (event)=>{
    setAddress(event.target.value);
    setErrorMessageAddress(!(event.target.value.length > 8))
  }

  const handleLogin=()=>{
    history.push('/login');
  }


  const signUpSubmit = ()=>{
    if(email && password && name && contact && address && !errorMessageEmail 
      && !errorMessagePassword && !errorMessageName && !errorMessageAddress && !errorMessageContact)
      {
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
        alert('Email or Contact is already Registered')
        setEmail('')
        setContact('')
      }
      else{
        alert('SignUp Failed')
      }
    })
    .catch(function (error) {
      alert(error.message);
    })
  }
  };

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };
    
  return (
    <React.Fragment>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6 offset-3 mt-4">
            <div className="mt-4" 
              style={{textAlign:"center",cursor:"pointer"}}>
              <img style={{height:"20%",width:"20%"}} src={Image} alt='signup Image'></img>
            </div>        
            <form style={{
               paddingLeft: "13%",
               paddingRight: "13%",
               paddingBottom:"3%"
               }}>
              <h3 className="text-black text-center mb-4">Looks, Like you are new Here!!</h3>
              <div className="form-group">
                <div class="input-group">
                  <div class="input-group-addon">
                      <i>{userIcon}</i>
                  </div>
                  <input 
                    className="form-control"
                    placeholder="Full Name"
                    onChange={validateName} 
                    value={name}
                    id="input1"
                  />
                </div>
              </div>
              {
                errorMessageName ? 
                <><span className="text-danger">Enter Full Name</span><br/></>
                
                :null
              }
              <div className="form-group">
                <div class="input-group">
                  <div class="input-group-addon">
                      <i>{emailIcon}</i>
                  </div>
                  <input 
                    className="form-control" 
                    placeholder="Email Address"
                    onChange={validateEmail} 
                    value={email}
                    id="input1"  
                  />
                </div>
              </div>
              {
                errorMessageEmail ? 
                <><span className="text-danger">Email Should be valid</span><br/></>:
                null
              }
              <div className="form-row">
                  <div className="form-group col-md-6">
                    <div class="input-group">
                      <div class="input-group-addon">
                          <i>{contactIcon}</i>
                      </div>
                        <input 
                          className="form-control" 
                          placeholder="Contact Number"
                          onChange={validateContact} 
                          value={contact}
                          id="input1"  
                        />
                      </div>
                  </div>
                  <div className="form-group col-md-6">
                    <div class="input-group">
                      <div class="input-group-addon">
                          <i>{passwordIcon}</i>
                      </div>
                      <input 
                        type={passwordShown ? "text" : "password"}
                        className="form-control" 
                        onChange={validatePassword} 
                        value={password}
                        placeholder="Password"
                        id="input1"
                      />
                    <div class="input-group-addon">
                      { passwordShown ?
                        <i onClick={togglePasswordVisiblity}>{eyeSlashIcon}</i>
                        :
                        <i onClick={togglePasswordVisiblity}>{eye}</i>
                      }
                    </div> 
                  </div>
                </div>
              </div>
              {
                errorMessageContact ? 
                <><span className="text-danger" style={{float:'left'}}>Contact should be 10 character long</span></>:
                null
              }
              {
                errorMessagePassword ? 
                <><span className="text-danger" style={{float:'right'}}>Password should have atleast 6 character</span><br/></>:
                null
              }
              <div className="form-group">
                  <div class="input-group">
                    <div class="input-group-addon">
                        <i>{addressIcon}</i>
                    </div>
                    <textarea 
                      className="form-control" 
                      placeholder="Enter Address Details"
                      onChange={validateAddress} 
                      value={address}
                      id="input1" 
                    />
                </div>
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
                <span className="text-primary" onClick={handleLogin} style={{cursor:"pointer"}}> 
                 Login?</span></span></>
                </div>
                :null
              }
              <button 
                type="button"
                className="btn btn-block btn-primary" 
                style={{padding:"2% 8%", float:"right",marginBottom:"3%"}}
                onClick={signUpSubmit}
              >
                Signup
              </button>
              <div className="text-center">
              <span 
                id="link"
                onClick={handleLogin}
              >
                Existing User? Log in 
              </span>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer/>
    </React.Fragment>
  );
}
export default SignUp;
