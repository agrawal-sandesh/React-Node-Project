import React from "react";
import { useHistory } from "react-router";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

const Header = () =>{
    const history = useHistory();
    const [cookies, setCookie, removeCookie] = useCookies(['PMartSecrete']);
    return(
      <nav className="navbar navbar-expand-lg bg-custom-2">
        <div className="navbar-header">
          <Link className="navbar-brand font-styling" to="/">PMart</Link>
        </div>
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link font-styling" to="/mycart">My Cart</Link>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link font-styling" to="/myorder">My Order</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link font-styling" onClick={()=> {
                removeCookie("Token");
                history.push('/login')
              } }>Logout</Link>
            </li>
          </ul>
      </nav> 
    )
  }

export default Header;