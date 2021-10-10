import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory} from "react-router-dom";
import { useCookies } from 'react-cookie';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ViewOrder = () =>{
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState('');
  const [subTotal, setSubTotal] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [total, setTotal] = useState(0);
  const [cookies, setCookie] = useCookies(['PMartSecrete']);

  useEffect(()=>{
    if(!cookies.Token) history.push("/login");
    getOrderData();
  }, [])

  const getOrderData = () =>{
    axios.post('http://localhost:4000/myorders',{
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


return (
<React.Fragment>
    <Header/>
        <div className="container-fluid">
        <div className="display-4 ml-4">
            Orders
        </div>
        <div className="row" >
            <div className='col-md-10 ml-4 mt-4 offset-1'>
            <div class="cart-box"> 
                    <div className="row">
                        <div className='col-md-3'>
                        <img class="image-box" src={props.cartProduct.image} alt="Card image"/>
                        </div>
                        <div className='col-md-6 mt-3'>
                        <div class='font'>
                            {props.cartProduct.name}
                        </div>
                        <div><strong>
                            Rate: ₹{props.cartProduct.rate}
                        </strong></div>
                        </div>
                        <div className='col-md-3 mt-2'>
                            Delivered Successfully!!
                        </div>
                    </div> 
                </div>
            </div>      
        </div>
    </div>
    <Footer/>  
</React.Fragment>
)
}

export default ViewOrder;