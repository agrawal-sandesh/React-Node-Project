import React from 'react';
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';
import Login from './components/Login.jsx';
import ViewCategories from './components/ViewCategories.jsx';
import ViewProducts from './components/ViewProducts.jsx';
import ViewProductDetails from './components/ViewProductDetails.jsx';
import { useHistory } from "react-router-dom";
import { useCookies } from 'react-cookie';

const Header = () =>{
  const history = useHistory();
  const [cookies, setCookie, removeCookie] = useCookies(['PMartSecrete']);
  return(
    <nav className="navbar navbar-expand-md bg-dark navbar-dark ">
      <div className="navbar-header">
        <Link className="navbar-brand" to="/">PMart</Link>
      </div>
      <ul className="navbar-nav mr-auto">  
        <li className="nav-item">
            <Link className="nav-link" to="/MyCart">My Cart</Link>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" onClick={()=> {
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
            <Route path="/products/:categoryid" component={ViewProducts}/>
            <Route path="/productdetails/:productid" component={ViewProductDetails}/>
            <Route path="/login" component={Login} />
          </Switch>
        </div>
      </React.Fragment>
    </Router>   
  );
}
export default App;
