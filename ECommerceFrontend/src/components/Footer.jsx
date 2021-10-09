import React from "react";
import { useHistory } from "react-router";
import '.././index.css'

const Footer = () =>{
    const history = useHistory();

    const handleClick=()=>{
        history.push('/')
    }

    return(
        <footer className="bg-dark text-center text-white py-3">Policies : Returns Policy | Terms of useSecurity | PrivacyInfringement | 
            <div className="footer-copyright text-center py-2 "> 
            © 2021 Copyright:<span onClick={handleClick}>  Home </span>
            </div>
        </footer>
      
    )
  }

export default Footer;