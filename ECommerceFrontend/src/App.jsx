import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Login from './pages/Login';
import ViewCategories from './pages/ViewCategories';
import ViewProducts from './pages/ViewProducts';
import ViewProductDetails from './pages/ViewProductDetails';
import ViewCart from './pages/ViewCart';
import ViewCheckout from './pages/ViewCheckout';
import SignUp from './pages/SignUp';
import SuccessPage from './pages/SuccessPage'
import { useCookies } from 'react-cookie';
import './index.css';

const App = () => { 
  const [cookies, setCookie, removeCookie] = useCookies(['PMartSecrete']);
  return (
    <Router>
      <React.Fragment>
          <Switch>
            <Route exact path="/" component={ViewCategories}/>
            <Route path="/products/:categoryId" component={ViewProducts}/>
            <Route path="/productdetails/:productId" component={ViewProductDetails}/>
            <Route path="/mycart" component={ViewCart}/>
            <Route path="/checkout" component={ViewCheckout}/>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            <Route path="/successpage" component={SuccessPage}/>
          </Switch>
      </React.Fragment>
    </Router>   
  );
}
export default App;
