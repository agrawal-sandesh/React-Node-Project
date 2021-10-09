import React from "react";
import '../index.css';

const CartProduct = (props) => {
return (
<div className="row">
  <div className='col-md-12'>
    <div class="cart-box">
      <img class="image-box" src={props.cartProduct.image} alt="Card image"/>
      <span style={{ position: "relative", left: "5%", bottom:"25px"}}>
        <strong>{props.cartProduct.name}</strong>
      </span>

      <span style={{ position: "relative", float:"right"}}>
        <strong>Rate: </strong> ₹{props.cartProduct.rate}
      </span>

      <span style={{ position: "relative", left: "15%", bottom:"25px"}}> 
        <button 
          onClick={()=> props.handleDecrementItem(props.cartProduct.cart_id)}
          disabled={parseInt(props.cartProduct.quantity)<=1} 
        >-</button>
        <span style={{ paddingLeft: '10px', paddingRight: '10px'}}>
          {props.cartProduct.quantity} 
        </span>
        <button onClick={()=> props.handleIncrementItem(props.cartProduct.cart_id)}>+</button> 
      </span>

      <span style={{ position: "relative", left: "25%",bottom:"30px"}}>
        <strong>Amount: </strong> ₹{parseInt(props.cartProduct.rate)*parseInt(props.cartProduct.quantity)}
      </span>

      <span style={{ position: "relative", left:"5%", top:"25px"}}
        onClick={()=> props.handleRemoveItem(props.cartProduct.cart_id)}>
        <u style={{color:"red"}}>Remove item</u>
      </span>
      
    </div>
  </div>
</div>
)
}

export default CartProduct;
