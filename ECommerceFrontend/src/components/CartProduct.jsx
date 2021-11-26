import React from "react";
import '../index.css';

const CartProduct = (props) => {
return (
<div class="cart-box"> 
    <div className="row">
        <div className='col-md-3'>
          <img class="image-box" src={props.cartProduct.image} alt="Card image"/>
        </div>

        <div className='col-md-3 mt-3'>
          <div>
            {props.cartProduct.name}
          </div>
          <div className="mt-5"> 
            <button 
              onClick={()=> props.handleDecrementItem(props.cartProduct.cart_id)}
              disabled={parseInt(props.cartProduct.quantity)<=1}>-
            </button>
            <span style={{ paddingLeft: '10px', paddingRight: '10px'}}>
              {props.cartProduct.quantity} 
            </span>
            <button 
              onClick={()=> props.handleIncrementItem(props.cartProduct.cart_id)}>+
            </button> 
          </div>
        </div>

        <div className='col-md-3 mt-3'> 
          <div><strong>
            Rate: ₹{props.cartProduct.rate}
          </strong></div>
          <div className='mt-5'><strong>
            Amount: ₹{parseInt(props.cartProduct.rate)*parseInt(props.cartProduct.quantity)}
          </strong></div>
        </div>
        
        <div className='col-md-3 mt-5'>
          <span
            id="link"
            onClick={()=> props.handleRemoveItem(props.cartProduct.cart_id)}>
            REMOVE
          </span>
        </div>
    </div> 
</div>
)
}

export default CartProduct;
