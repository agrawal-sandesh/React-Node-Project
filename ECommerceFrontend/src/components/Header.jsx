import React from "react";
import { useHistory } from "react-router";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReceipt, faSearch, faShoppingCart, faSignOutAlt, faUser} from '@fortawesome/free-solid-svg-icons';
import '.././index.css';

const Header = () =>{
    const history = useHistory();
    const [cookies, setCookie, removeCookie] = useCookies(['PMartSecrete']);
    const name = cookies ? (cookies.Token ? cookies.Token.name : '') : '';
    if(name.split(' ').length>1){
      var firstName = name.split(' ').slice(0, -1).join(' ');
    }
    else{
    var firstName = name 
    }
    return(
      <nav className="navbar navbar-expand-lg navbar-dark bg-custom-2" >
          <Link className="navbar-brand font-styling" to="/">PMart</Link>
          <div className="d-flex justify-content-center" style={{flex: 1}}>
            <div className="search-bar pr-3">
              <input className="search-bar-input" type="text" placeholder="Search Items" />
              <FontAwesomeIcon icon={faSearch} style={{color: '#430297'}} onClick={()=> alert("hello")}/>
            </div>            
          </div>
          <ul className="nav navbar-nav" style={{marginRight:"8%"}}>
            <li className="nav-item active mr-5">
              <Link className="nav-link font-styling" to="/mycart"><FontAwesomeIcon
              icon={faShoppingCart}/> Cart</Link>
            </li>
            <li className="nav-item active">
                <div class="nav-item dropdown active">
                  <span class="nav-link dropdown-toggle font-styling" style={{cursor: "pointer"}}>
                    Hi {firstName}</span>
                  <div class="dropdown-menu">
                    <Link className="dropdown-item" to="/myprofile">
                    <FontAwesomeIcon icon={faUser}/> My Profile
                    </Link>
                    <Link className="dropdown-item" to="/mycart">
                    <FontAwesomeIcon icon={faShoppingCart}/> Cart
                    </Link>
                    <Link className="dropdown-item" to="/myorder">
                    <FontAwesomeIcon icon={faReceipt}/> Orders
                    </Link>

                    <div className="dropdown-divider"></div>

                    <Link className="dropdown-item" onClick={()=> {
                      removeCookie("Token");
                      history.push('/login')
                      } }>
                      <FontAwesomeIcon icon={faSignOutAlt}/> Logout
                    </Link>
                  </div>
              </div>
            </li>
          </ul>
      </nav>
    )
  }

export default Header;
