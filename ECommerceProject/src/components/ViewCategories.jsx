import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { useCookies } from 'react-cookie';
import CategoryBox from './CategoryBox';


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
  <React.Fragment className="container-fluid">
      <h3 className="text-primary" className="display-4">
        Categories
      </h3>
      <div className="row">
        {
          categoryData ? 
          categoryData.map(category => 
            <CategoryBox 
            key={category.CategoryID}
            category={category}
            handleClick={handleClick} 
            />
          ):
          null
        }
        {errorMessage ? <h2 className="container" >{errorMessage}</h2>: null}
      </div>
  </React.Fragment>
  )
}

export default ViewCategories;