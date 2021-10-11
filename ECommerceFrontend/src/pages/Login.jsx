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
    if (email && password && !errorMessageEmail && !errorMessagePassword){
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
        alert('User not registered, Try again!!')
        setEmail('');
        setPassword('');
      }
    })
    .catch(function (error) {
      alert(error.message);
    });
  }
  }
    
  return (
    <React.Fragment>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4 offset-4 mt-4">        
            <form 
              style={{ 
                border: "1px solid gray", 
                padding: "10%", 
                marginTop :"15%",
                boxShadow:"5px 5px 10px gray", 
                backgroundColor:"white"
              }}
            >
              <h2 className="text-center">Login!</h2>
              <div className="form-group">
                <input 
                  className="form-control" 
                  onChange={validateEmail} 
                  value={email}
                  placeholder="Email Address"
                  id="input1" 
                />
              </div>
              <div>
              {
                errorMessageEmail ? 
                <><span className="text-danger">Enter Your Email address</span></>:
                null
              }
              </div>
              <div className="form-group">
                <input 
                  className="form-control" 
                  onChange={validatePassword} 
                  value={password}
                  placeholder="Password"
                  id="input1"
                />
              </div>
              <div>
              {
                errorMessagePassword ? 
                <><span className="text-danger">Enter Valid Password</span></>:
                null
              }
              </div>
              <button 
                type="button"
                className="btn btn-block btn-success" 
                style={{padding:"2% 8%"}}
                onClick={loginSubmit}
              >
                Login
              </button>
              <div className="text-center">
              <button 
                type="button"
                className="btn btn-link"
                onClick={handleSignUp}
              >
                Create a new account ?
              </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
export default Login;
