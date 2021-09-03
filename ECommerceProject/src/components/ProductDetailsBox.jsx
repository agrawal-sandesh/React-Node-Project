import React from "react";
import '../index.css';

const ProductDetailsBox = (props) => {
return (  
<div className="row">
  <div className='col-md-5  offset-md-1 '>
      <div className="card">
        <div className='card-header bg-gradient-light'> 
          <img className="card-img-top" src={props.productDetails.Image} alt="Card image" />
        </div>
        <div className='card-body'>
          <div className="card-text">
            <h3 className="card-title" className="text-center">{props.productDetails.Name}</h3>
            <h4>Rate: {props.productDetails.Rate} </h4>
          </div>
        </div>   
      </div>
  </div><br/>
  <div className='col-md-5'>
      <div className="card">
        <div className='card-header bg-gradient-light'> 
          <i>Details: {props.productDetails.Details}</i><br/>
        </div>
        <div className='card-body'>
          <button 
            type="button" 
            className="btn btn-outline-warning " 
            style={{marginLeft:"10%", padding:"3% 8%"}}
            onClick={()=> props.handleAddToCart(props.productDetails.ProdID)}
          >
              Add to Cart
          </button>
          <button 
            type="button" 
            className="btn btn-outline-success btn-large" 
            style={{marginLeft:"10%",padding:"3% 8%"}}
            onClick={()=> props.handleOrderNow(props.productDetails.ProdID)}
          >
            Order Now
          </button>
        </div>
      </div>
  </div>
</div>
)
}

export default ProductDetailsBox;
