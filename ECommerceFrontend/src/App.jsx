import React from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import Login from './pages/Login';
import ViewCategories from './pages/ViewCategories';
import ViewProducts from './pages/ViewProducts';
import ViewProductDetails from './pages/ViewProductDetails';
import ViewCart from './pages/ViewCart';
import ViewCheckout from './pages/ViewCheckout';
import SignUp from './pages/SignUp';
import SuccessPage from './pages/SuccessPage'
import MyProfile from './pages/MyProfile'
import ViewOrder from './pages/ViewOrder';
import './index.css';

const App = () => { 
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
            <Route path="/myprofile" component={MyProfile}/>
            <Route path="/myorder" component={ViewOrder}/>
          </Switch>
      </React.Fragment>
    </Router>   
  );
}
export default App;
