import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useParams } from "react-router-dom";
import { useCookies } from 'react-cookie';
import Header from '../components/Header';
// import Footer from '../components/Footer';

const ViewProductDetails = () =>{
  const history = useHistory();
  let { productId } = useParams();
  const [productDetails, setProductDetails] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies, setCookie] = useCookies(['PMartSecrete']);

  useEffect(()=>{
    if(!cookies.Token) history.push("/login");
    getProductDetails();
  }, []);

  const getProductDetails = () =>{
    axios.post('http://localhost:4000/productdetails',{
      productId: productId,
      customerId: cookies ? (cookies.Token? cookies.Token.customer_id : '') : ''
    })
    .then(response => {
      if(response.data.status === 'success')
        setProductDetails(response.data.res[0]);
      else
        setErrorMessage(response.data.msg);
    })
    .catch(error => {
      setErrorMessage(error);
    })
  }

  const handleAddToCart = () =>{
    axios.post('http://localhost:4000/addcart',{
      productId: productId,
      customerId: cookies ? (cookies.Token? cookies.Token.customer_id : '') : ''
    })
    .then(response => {
        if(response.data.status === 'success')
          getProductDetails();
        else
          setErrorMessage(response.data.msg);
    })
      .catch(error => {
          setErrorMessage(error);
    })
    alert("Item Added in cart")
  }


  const handleOrderNow = () =>{
    axios.post('http://localhost:4000/addcart',{
      productId: productId,
      customerId: cookies ? (cookies.Token? cookies.Token.customer_id : '') : ''
    })
    .then(response => {
        if(response.data.status === 'success')
          history.push(`/mycart`)
        else
          setErrorMessage(response.data.msg);
    })
      .catch(error => {
          setErrorMessage(error);
    })
  }

  const handleViewCart = () =>{
    history.push(`/mycart`)
  }

  return (
  <React.Fragment>
    <Header/>
      <div className="container-fluid">
        <div className="display-4 ml-4">
          Products Details
        </div>
        <div className="row">
          <div className='col-md-4 mt-4' style={{marginLeft:"5%"}}>
              <div className="card">
                <div className='card-body'> 
                  <img className="card-img-top" src={productDetails.image} alt="Card image" />
                </div>
              </div>  
          </div>
          <div className='col-md-7 mt-4'>
              <div className="card">
                <div className='card-header bg-gradient-light'>
                  <h4 className="text-center">{productDetails.name} </h4> 
                  <h4>Rate: ₹{productDetails.rate} </h4> 
                  <i>Details: {productDetails.details}</i><br/>
                </div>
                <div className='card-body'>
                  {
                    productDetails.cart_id ?
                    <button 
                      type="button" 
                      className="btn btn-info" 
                      style={{marginLeft:"35%",padding:"1% 7%",borderRadius:"20px"}}
                      onClick={handleViewCart}
                    >
                      View Cart
                    </button>:
                      <>
                        <button 
                          type="button" 
                          className="btn btn-warning" 
                          style={{marginLeft:"15%",padding:"1% 6%",borderRadius:"20px"}}
                          onClick={handleAddToCart}
                        >
                          Add to Cart
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-success" 
                          style={{marginLeft:"15%",padding:"1% 6%",borderRadius:"20px"}}
                          onClick={handleOrderNow}
                        >
                          Order Now
                        </button>
                      </>                  
                  }
                </div>
              </div>
          </div>
        </div>
          {errorMessage ? <h2 className="container" >{errorMessage}</h2>: null}
      </div> 
    {/* <Footer/>      */}
  </React.Fragment>
  )
}

export default ViewProductDetails;