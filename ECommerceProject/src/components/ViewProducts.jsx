import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useParams } from "react-router-dom";
import { useCookies } from 'react-cookie';
import ProductBox from './ProductsBox.jsx';

const ViewProducts = () =>{
  const history = useHistory();
  let { categoryid } = useParams();
  const [productData, setProductData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies, setCookie] = useCookies(['PMartSecrete']);

  useEffect(()=>{
    if(!cookies.Token) history.push("/login");
    axios.post('http://localhost:4000/products',{
      CategoryID:categoryid
    })
    .then(response => {
      if(response.data.status === 'success')
        setProductData(response.data.res);
      else
        setErrorMessage(response.data.msg);
    })
    .catch(error => {
      setErrorMessage(error);
    })
  }, [])

  const handleMoveToNext = (productId) =>{
    history.push(`/productdetails/${productId}`)
  }

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
        Products
      </h3>
      <div className="row">
        { 
          productData?
          productData.map(product => 
            <ProductBox 
              key={product.ProdID} 
              product={product} 
              handleMoveToNext={handleMoveToNext}
              handleAddToCart={handleAddToCart}
              handleOrderNow={handleOrderNow}
            />
          ):
          null
        }
        {errorMessage ? <h2 className="container" >{errorMessage}</h2>: null}
      </div>
    </div>
  </React.Fragment>
  )
}

export default ViewProducts;