import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory} from "react-router-dom";
import { useCookies } from 'react-cookie';
import CartProduct from '../components/CartProduct';

const ViewProducts = () =>{
  const history = useHistory();
  const [cartProductData, setCartProductData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [subTotal, setSubTotal] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [total, setTotal] = useState(0);
  const [cookies, setCookie] = useCookies(['PMartSecrete']);

  useEffect(()=>{
    if(!cookies.Token) history.push("/login");
    getCartData();
  }, [])

  const getCartData = () =>{
    axios.post('http://localhost:4000/mycart',{
      customerId: cookies.Token.customer_id
    })
    .then(response => {
      if(response.data.status === 'success'){
        setCartProductData(response.data.res);
        let tempSubTotal = 0
        response.data.res.forEach(item =>{
          tempSubTotal = parseInt(tempSubTotal) + (parseInt(item.quantity) * parseInt(item.rate))
        })
        setSubTotal(tempSubTotal)
        let tempDeliveryCharge = tempSubTotal * 8/100
        setDeliveryCharge(tempDeliveryCharge)
        setTotal(tempSubTotal + tempDeliveryCharge)
      }
      else{
        setCartProductData([]);
        setErrorMessage(response.data.msg);
      }
    })
    .catch(error => {
      setErrorMessage(error);
    })
  }

  const handleRemoveItem = (cartId) =>{
    axios.post('http://localhost:4000/removecartitem',{
      cartId: cartId
    })
    .then(response => {
      if(response.data.status === 'success')
        getCartData()
      else{
        setCartProductData([]);
        alert(response.data.msg);
      }
    })
    .catch(error => {
      alert(error);
    })
    
  }
  
  const handleIncrementItem = (cartId) =>{
    axios.post('http://localhost:4000/incrementcartitem',{
      cartId: cartId
    })
    .then(response => {
      if(response.data.status === 'success')
        getCartData()
      else
        alert(response.data.msg);
    })
    .catch(error => {
      alert(error);
    })
  }

  const handleDecrementItem = (cartId) =>{
    axios.post('http://localhost:4000/decrementcartitem',{
      cartId: cartId
    })
    .then(response => {
      if(response.data.status === 'success')
        getCartData()
      else
        alert(response.data.msg);
    })
    .catch(error => {
      alert(error);
    })
  }

  const handleProceedToBuy = ()=>{
    history.push('/checkout')
  }

  return (
  <React.Fragment className="container">
      <div className="display-4" style={{marginLeft:"2%"}}>
          Cart
      </div>
      <div className="row" >
        <div className='col-md-7 ml-4 mt-4'>
          { 
            cartProductData.length > 0 ?
              cartProductData.map(cartProduct => 
                <CartProduct 
                  key={cartProduct.product_id} 
                  cartProduct={cartProduct}
                  handleRemoveItem={handleRemoveItem}
                  handleIncrementItem={handleIncrementItem}
                  handleDecrementItem={handleDecrementItem}
                />
              ):
              null
          }
        </div>
        {
          cartProductData.length>0? 
          <div className='col-md-4 mt-4'
          style={{backgroundColor:'whitesmoke'}}
          >
            <div><strong>Subtotal: </strong>{subTotal}</div>
            <div><strong>Delivery Charges: </strong>{deliveryCharge}</div>
            <hr />
            <div><strong>Total: </strong>{total}</div>
            <hr />
            <button className="btn btn-warning"  style={{marginLeft:"25%",padding:"1% 10%",borderRadius:"20px"}}
            onClick={handleProceedToBuy}>Proceed to Buy</button> 
          </div>:
          null
        }
        {errorMessage ? <h2 className="container" >{errorMessage}</h2>: null}      
      </div>
  </React.Fragment>
  )
}

export default ViewProducts;