import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useParams } from "react-router-dom";
import { useCookies } from 'react-cookie';
import Product from '../components/Product';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ViewProducts = () =>{
  const history = useHistory();
  let { categoryId } = useParams();
  const [productData, setProductData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies, setCookie] = useCookies(['PMartSecrete']);
  const [searchItem,setSearchItem] = useState('');

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

  const searchBar=(event)=>{
    setSearchItem(event);
  }

  return (
  <React.Fragment className="container">
    <Header searchFunc={searchBar} />
    <div className="container-fluid">
      <div className="display-4 ml-4">
          Products
      </div>
        <div className="row">
          { 
            productData?
            productData.filter(productData=>{
              if(searchItem==""){
                return productData
              }
              else if(productData.name.toLowerCase().includes(searchItem.toLowerCase())){
                return productData
              }
            }).map(productData => 
              <Product 
                key={productData.product_id} 
                productData={productData} 
                handleMoveToNext={handleMoveToNext}
              />
            ):
            null
          }
          {errorMessage ? <h2 className="container" >{errorMessage}</h2>: null}
        </div>
      </div>
      <Footer/>
  </React.Fragment>
  ) 
}

export default ViewProducts;