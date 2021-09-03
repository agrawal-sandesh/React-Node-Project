import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useParams } from "react-router-dom";
import { useCookies } from 'react-cookie';
import ProductDetailsBox from './ProductDetailsBox';

const ProductDetails = () =>{
  const history = useHistory();
  let { productid } = useParams();
  const [productDetails, setProductDetails] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies, setCookie] = useCookies(['PMartSecrete']);

  useEffect(()=>{
    if(!cookies.Token) history.push("/login");
    axios.post('http://localhost:4000/productdetails',{
      ProductId:productid
    })
    .then(response => {
      if(response.data.status === 'success')
      setProductDetails(response.data.res);
      else
        setErrorMessage(response.data.msg);
    })
    .catch(error => {
      setErrorMessage(error);
    })
  }, [])

  const handleAddToCart = (productId) =>{
    alert('Added to cart api call');
  }

  const handleOrderNow = (productId) =>{
    alert('order now api call');
  }

  return (
  <React.Fragment className="container-fluid">
    <div style={{backgroundColor:"#F8F8FF"}}>
      <h3 className="text-primary" className="display-4">
        Products Details
      </h3>
        { 
          productDetails?
          productDetails.map(productDetails => 
            <ProductDetailsBox
              key={productDetails.ProdID} 
              productDetails={productDetails} 
              handleAddToCart={handleAddToCart}
              handleOrderNow={handleOrderNow}
            />
          ):
          null
        }
        {errorMessage ? <h2 className="container" >{errorMessage}</h2>: null}
    </div>  
  </React.Fragment>
  )
}

export default ProductDetails;