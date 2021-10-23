import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory} from "react-router-dom";
import { useCookies } from 'react-cookie';
import Header from '../components/Header';

const ViewOrder = () =>{
  const history = useHistory();
  const [cookies, setCookie] = useCookies(['PMartSecrete']);
  const [orderDetails, setOrderDetails] = useState([]);
  const [errorMessage,setErrorMessage]=useState('');
  const [searchItem,setSearchItem]=useState('');

  useEffect(()=>{
    if(!cookies.Token) history.push("/login");
    getOrderDetails();
  }, [])

  const getOrderDetails = () =>{
    axios.post('http://localhost:4000/orderitems',{
      customerId: cookies ? (cookies.Token? cookies.Token.customer_id : '') : ''
    })
    .then(response => {
      if(response.data.status === 'success'){
          setOrderDetails(response.data.res)
        }
      else{
        setErrorMessage(response.data.msg);
      }
    })
    .catch(error => {
      setErrorMessage(error);
    })
  }

  const handleAddOrders=()=>{
    history.push('/')
  }

return (
  <React.Fragment>
      <Header/>
          <div className="container-fluid">
            <div className="display-4 ml-4">
              Order Page
              { 
                orderDetails.length>0?
                <button 
                  className="btn btn-primary mt-4" 
                  style={{float:"right",marginRight:"5%"}}
                  onClick={handleAddOrders}
                  >
                      Shop More  
                  </button>
                  :null
              }
            </div>
            <div className="row" >
              <div className='col-md-10 mt-4 offset-1'>
                    {
                      orderDetails.length>0?
                        <input
                            class="ordersearch"
                            type="text" 
                            placeholder="Search Your Orders Here.."
                            onChange={(event)=>{
                              setSearchItem(event.target.value);
                            }}
                            />
                            :null
                    }
                    { 
                      orderDetails ?
                        orderDetails.filter(orderDetails=>{
                          if(searchItem==""){
                            return orderDetails
                          }
                          else if(orderDetails.name.toLowerCase().includes(searchItem.toLowerCase())){
                            return orderDetails
                          }
                        }).map(orderDetails => 
                          <div class="cart-box">
                             <div className="row" >
                                <div className='col-md-1'>
                                <img class="image-box" src={orderDetails.image} alt="Card image"/>
                                </div>
                                <div className='col-md-4 ml-5'>
                                <div class='font'>
                                    {orderDetails.name}
                                </div><br/>
                                <div>
                                    No of Item: {orderDetails.quantity}
                                </div>
                                </div>
                                <div className='col-md-2'>
                                <div>
                                  Price : ₹{orderDetails.rate}
                                </div><br/>
                                <div>
                                  Total : ₹{orderDetails.total_amount}
                                </div>
                                </div>
                                <div className='col-md-3'>
                                <strong>Status : </strong>
                                <span style={{color:"orange",fontSize:"22px"}}> ● </span>
                                {orderDetails.delivery_status}
                                </div> 
                              </div>
                          </div>
                    ):
                    null
                    } 
                      {errorMessage ?
                        <div class= "empty-box">
                          <h3>{errorMessage}
                            <button className="btn btn-primary ml-3" onClick={handleAddOrders}>
                              Place Order
                          </button>
                          </h3>
                        </div>
                  : null}
              </div>      
            </div>
          </div>
          <div>
          </div> 
  </React.Fragment>
)
}

export default ViewOrder;