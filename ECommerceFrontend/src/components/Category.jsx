import React from "react";
import '../index.css';

const Category = (props) => {
return (
  <div className='col-md-5' style={{marginLeft:"5%"}}>
    <div className="card" 
        style={{backgroundColor: "#b3cdd1",
        backgroundImage: "linear-gradient(315deg, #b3cdd1 0%, #9fa4c4 74%)",
        margin:"5%"}}
        onClick={()=> props.handleClick(props.category.category_id)}
    >
      <div className='card-body'style={{padding:"6%"}}>
          <h2 className="card-title " className="text-center">
            {props.category.name }
          </h2>
      </div>
    </div>
  </div>
);
}
  
export default Category;
