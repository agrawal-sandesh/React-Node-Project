import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useParams } from "react-router-dom";
import { useCookies } from 'react-cookie';
import Product from '../components/Product';

const ViewProducts = () =>{
  const history = useHistory();
  let { categoryId } = useParams();
  const [productData, setProductData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies, setCookie] = useCookies(['PMartSecrete']);

  useEffect(()=>{
    if(!cookies.Token) history.push("/login");
    axios.post('http://localhost:4000/products',{
      categoryId:categoryId
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

  return (
  <React.Fragment className="container">
    <div className="display-4">
        Products
    </div>
      <div className="row">
        { 
          productData?
          productData.map(product => 
            <Product 
              key={product.product_id} 
              product={product} 
              handleMoveToNext={handleMoveToNext}
            />
          ):
          null
        }
        {errorMessage ? <h2 className="container" >{errorMessage}</h2>: null}
      </div>
  </React.Fragment>
  )
}

export default ViewProducts;