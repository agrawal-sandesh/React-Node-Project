import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import '../index.css';
import { useCookies } from 'react-cookie';

const Login =()=>{
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessageEmail, setErrorMessageEmail] = useState(false);
  const [errorMessagePassword, setErrorMessagePassword] = useState(false);
  const [cookies, setCookie] = useCookies(['PMartSecrete']);

  useEffect(()=>{
    if(cookies.Token) history.push("/");
  }, []);


  const validateEmail = (event)=>{
    setEmail(event.target.value);
    setErrorMessageEmail(!(event.target.value.includes('@')))
  }

  const validatePassword = (event)=>{
    setPassword(event.target.value);
    setErrorMessagePassword(!(event.target.value.length > 5))
  }

  const handleSignUp=()=>{
    history.push("/signup")
  }

  const loginSubmit = ()=>{
    axios
    .post('http://localhost:4000/login', {
      email: email,
      password: password,
    })
    .then(response=> {
      if(response.data.status === 'success'){
        setCookie('Token', response.data.res)
        history.push("/");
      }else{
        alert('User not registered')
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
          <div className="col-md-4 offset-4">        
            <form 
              style={{ 
                border: "1px solid gray  ", 
                padding: "30px", 
                borderRadius: "8px", 
                marginTop :"15%",
                boxShadow:"5px 5px 10px gray", 
                backgroundColor:"#F5F5F5"
              }}
            >
              <h2 className="text-success text-center">Login Here</h2>
              <div className="form-group">
                <label>Username:</label>
                <input 
                  className="form-control" 
                  style={{backgroundColor:"#F5FFFA"}} 
                  onChange={validateEmail} 
                  value={email} 
                />
              </div>
              {
                errorMessageEmail ? 
                <><span className="text-danger">Incorrect Username</span><br/></>:
                null
              }
              <div className="form-group">
                <label>Password:</label>
                <input 
                  className="form-control" 
                  style={{backgroundColor:"#F5FFFA"}} 
                  onChange={validatePassword} 
                  value={password}
                />
              </div><br/>
              {
                errorMessagePassword ? 
                <><span className="text-danger">Please Enter the Correct Password</span><br/></>:
                null
              }
              <button 
                type="button"
                className="btn btn-primary" 
                style={{padding:"2% 8%"}}
                onClick={handleSignUp} 
              >
                SignUp
              </button>
              <button 
                type="button"
                className="btn btn-success" 
                style={{padding:"2% 8%",float:"right"}}
                disabled={!(email && password && !errorMessageEmail && !errorMessagePassword)} 
                onClick={loginSubmit}
              >
                Login
              </button>
              <br/>
            </form>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
export default Login;
