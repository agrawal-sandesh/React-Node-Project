import React from "react";
import '../index.css';

const Category = (props) => {
return (
  <div className='col-md-4'>
    <div className="card" 
      style={{backgroundColor:"#f9f4d9", margin:"5%"}}
      onClick={()=> props.handleClick(props.category.CategoryID)}>
        <div className='card-body'>
            <h2 className="card-title " className="text-center">
              {props.category.Name}
          </h2>
        </div>
    </div>
  </div>
);
}

export default Category;
