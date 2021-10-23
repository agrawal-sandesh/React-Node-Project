import React from "react";
import '../index.css';

const Product = (props) => {
  return (  
    <div className='col-md-3 mt-4 mb-4'>
      <div className="card" style={{cursor:"pointer"}}>
        <div className='card-header bg-gradient-light'
          onClick={()=> props.handleMoveToNext(props.productData.product_id)}> 
          <img className="card-img-top" 
          src={props.productData.image} alt="Card image" />
        </div>
        <div className='card-body'onClick={()=> props.handleMoveToNext(props.productData.product_id)}>
          <div className="card-text">
            <h5 className="card-title " className="text-center" 
            onClick={()=> props.handleMoveToNext(props.productData.product_id)}>
              {props.productData.name}
            </h5> 
            <span onClick={()=> props.handleMoveToNext(props.productData.product_id)}>
            <strong>Price: </strong> ₹{props.productData.rate}</span>
            <br/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Product;
