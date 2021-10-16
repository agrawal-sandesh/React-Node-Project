import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { useCookies } from 'react-cookie';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ViewCategories = () =>{
  const history = useHistory();
  const [categoryData, setCategoryData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies, setCookie] = useCookies(['PMartSecrete']);

  useEffect(()=>{
    if(!cookies.Token) history.push("/login");
      Categories();
  },[])

  const Categories=()=>{
    axios.get('http://localhost:4000/categories')
    .then(response => {
      if(response.data.status === 'success')
        setCategoryData(response.data.res);
      else
        setErrorMessage(response.data.msg);
    })
    .catch(error => {
      setErrorMessage(error);
    });
  }

  const handleMoveNext = (CategoryID) =>{
    history.push(`/products/${CategoryID}`)
  }

  return (
    <React.Fragment>
      <Header/>
        <div class="container-fluid">
          <div className="display-4">
            Categories
          </div>
          <div className="row">
            {
              categoryData ? 
                categoryData.map(category => 
                  <div className='col-md-11 mt-4' style={{marginLeft:"4%"}}>
                    <div className="h3 mb-3">
                      {category.category_name}
                      <div id="link" style={{float:"right"}} onClick={()=> handleMoveNext(category.category_id)}>
                        More Items..
                      </div>
                    </div>
                      <div class="row mb-3" 
                      style={{borderRadius:"8px", padding:"2%", backgroundColor:"whitesmoke"}}>
                        {category.products.slice(0,4).map(product =>
                          <div class="col-md-3">
                              <div className="card" style={{cursor:"pointer"}}
                                onClick={()=> handleMoveNext(category.category_id)}
                              >
                                <div className='card-header bg-gradient-light'> 
                                  <img className="card-img-top" class="image-box" src={product.product_img} alt="Image" />
                                </div>
                                <div className='card-body'>
                                  <div className="card-text">
                                    <h5 className="card-title" className="text-center" >
                                      {product.product_name}
                                    </h5> 
                                    <div className="text-center text-muted"> Shop Now! </div>
                                  </div>
                                </div>
                              </div>
                          </div>
                        )}  
                    </div>
                  </div>
              ):null
            }
            {errorMessage ? <h2>{errorMessage}</h2>: null}
          </div>
        </div>
      <Footer/>
    </React.Fragment>
  )
}

export default ViewCategories;