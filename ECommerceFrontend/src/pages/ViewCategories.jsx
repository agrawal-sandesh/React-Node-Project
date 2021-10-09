import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { useCookies } from 'react-cookie';
import Category from '../components/Category';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ViewCategories = () =>{
  const history = useHistory();
  const [categoryData, setCategoryData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies, setCookie] = useCookies(['PMartSecrete']);

  useEffect(()=>{
    if(!cookies.Token) history.push("/login");
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
  },[])

  const handleClick = (CategoryID) =>{
    history.push(`/products/${CategoryID}`)
  }

  return (
  <React.Fragment>
    <Header/>
      <div class="container-fluid">
        <div className="display-4 ml-4">
          Categories
        </div>
        <div className="row">
          {
            categoryData ? 
              categoryData.map(category => 
              <Category 
              key={category.category_id}
              category={category}
              handleClick={handleClick} 
              />
            ):
            null
          }
          {errorMessage ? <h2>{errorMessage}</h2>: null}
        </div>
      </div>
    <Footer/>
  </React.Fragment>
  )
}

export default ViewCategories;