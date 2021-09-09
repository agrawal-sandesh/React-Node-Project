import React from 'react';
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';
import Login from './pages/Login';
import ViewCategories from './pages/ViewCategories';
import ViewProducts from './pages/ViewProducts';
import ViewProductDetails from './pages/ViewProductDetails';
import ViewCart from './pages/ViewCart';
import ViewCheckout from './pages/ViewCheckout'
import { useHistory } from "react-router-dom";
import { useCookies } from 'react-cookie';
import './index.css';

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
            <Link className="nav-link font-styling" onClick={()=> {
              removeCookie("Token");
              history.push('/login')
            } }>Logout</Link>
          </li>
        </ul>
    </nav> 
  )
}

const App = () => { 
  return (
    <Router>
      <React.Fragment>
        <div>
          <Header />
          <Switch>
            <Route exact path="/" component={ViewCategories}/>
            <Route path="/products/:categoryId" component={ViewProducts}/>
            <Route path="/productdetails/:productId" component={ViewProductDetails}/>
            <Route path="/mycart" component={ViewCart}/>
            <Route path="/checkout" component={ViewCheckout}/>
            <Route path="/login" component={Login} />
          </Switch>
        </div>
      </React.Fragment>
    </Router>   
  );
}
export default App;
