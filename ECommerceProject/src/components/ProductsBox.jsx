import React from "react";
import '../index.css';

const Products = (props) => {
return (  
  <div className='col-md-3 offset-md-1'>
    <div className="card">
      <div className='card-header bg-gradient-light'
        onClick={()=> props.handleMoveToNext(props.product.ProdID)}> 
        <img className="card-img-top" src={props.product.Image} alt="Card image" />
      </div>
      <div className='card-body'>
        <div className="card-text">
          <h5 className="card-title " className="text-center">
            {props.product.Name}
          </h5> 
          <span><strong>Rate: </strong> {props.product.Rate}</span>
          <br/>
        </div>
        <div className='card-footer bg-gradient-light'>
          <button 
            type="button" 
            className="btn btn-outline-warning btn-block" 
            onClick={()=> props.handleAddToCart(props.product.ProdID)}
          >
              Add to Cart
          </button><br/>
          <button 
            type="button" 
            className="btn btn-outline-success btn-block" 
            onClick={()=> props.handleOrderNow(props.product.ProdID)}
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  </div>
)
}

export default Products;
