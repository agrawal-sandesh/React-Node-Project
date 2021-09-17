import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory} from "react-router-dom";
import { useCookies } from 'react-cookie';
import Address from '../components/Address';

const ViewCheckout = () =>{
  const history = useHistory();
  const [checkoutProductData, setCheckoutProductData] = useState([]);
  const [addressData, setAddressData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [address,setAddress]=useState('');
  const [isAddAddressVisible, setIsAddAddressVisible] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [total, setTotal] = useState(0);
  const [cookies, setCookie] = useCookies(['PMartSecrete']);

  useEffect(()=>{
    if(!cookies.Token) history.push("/login");
    getPaymentData();
    getAddressData();
  }, [])

  const getPaymentData = () =>{
    axios.post('http://localhost:4000/mycart',{
      customerId: cookies.Token.customer_id
    })
    .then(response => {
      if(response.data.status === 'success'){
        setCheckoutProductData(response.data.res);
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
        setCheckoutProductData([]);
        setErrorMessage(response.data.msg);
      }
    })
    .catch(error => {
      setErrorMessage(error);
    })
  }

  const getAddressData=()=>{
    axios.post('http://localhost:4000/address',{
      customerId:cookies.Token.customer_id
    })
    .then(response => {
      if(response.data.status === 'success')
        setAddressData(response.data.res);
      else
        setAddressData([]);
      setErrorMessage(response.data.msg);
    })
    .catch(error => {
      setErrorMessage(error);
    });
  }

  const handleProceedToPayment = ()=>{
    history.push('/payment')
  }

  const handleNewAddressButton=(buttonState)=>{
    switch (buttonState){
      case 'open':
        setIsAddAddressVisible(true)
        break;
      case 'close':
        setIsAddAddressVisible(false)
        break;
      default:
        setIsAddAddressVisible(false)
        break;
    }
  }

  const addAddress = () =>{
    axios.post('http://localhost:4000/addaddress',{
      customerId:cookies.Token.customer_id,
      address:address
    })
    .then(response => {
      if(response.data.status === 'success'){
        getAddressData()
        setAddress('');
        handleNewAddressButton('close')
      }else setErrorMessage(response.data.msg);
    })
    .catch(error => {
      setErrorMessage(error);
    });
  }

  const clickedAddress = (clickedAddressId) =>{
      axios.post('http://localhost:4000/updateDefaultAddress',{
      customerId:cookies.Token.customer_id,
      addressId:clickedAddressId
    })
    .then(response => {
      if(response.data.status === 'success'){
        getAddressData()
      }else setErrorMessage(response.data.msg);
    })
    .catch(error => {
      setErrorMessage(error);
    });
  }

const handleRemoveAddress=(addressId)=>{
  axios.post('http://localhost:4000/removeaddress',{
    customerId:cookies.Token.customer_id,
    addressId:addressId
  })
  .then(response => {
    if(response.data.status === 'success'){
      getAddressData()
    }else setErrorMessage(response.data.msg);
  })
  .catch(error => {
    setErrorMessage(error);
  });
}


  return (
    <React.Fragment>
      <div className="display-4 container" style={{marginLeft:"2%"}}>
          Checkout Page
      </div>
      <div className="row" >
        <div className='col-md-7 ml-3'>
          <div className='card-header' className=''>
          <h5 style={{color:"white"}}> DELIVERY ADDRESS</h5>
          </div>
          { 
            addressData.length > 0 ?
              addressData.map(addressData => 
                  <Address 
                    key={addressData.address_id} 
                    addressData={addressData}
                    handleProceedToPayment={handleProceedToPayment}
                    clickedAddress={clickedAddress}
                    handleRemoveAddress={handleRemoveAddress}
                  />
                ):
                null
          }
          <div>
            {
              !isAddAddressVisible?
                <button className="btn btn-block btn-primary mb-3" 
                onClick={()=> handleNewAddressButton('open')}>
                  ADD A NEW
                </button>
                :
                <div>
                  <div className="form-group">
                    <textarea 
                      className="form-control" 
                      rows="4" 
                      value={address}
                      placeholder="Enter Address Here" 
                      onChange={e => setAddress(e.target.value)}>{address}</textarea>
                  </div>
                  <button className="btn float-right btn-success mb-3" 
                  onClick={addAddress}>
                      Add
                  </button>
                  <button className="btn float-right btn-danger mr-2" 
                  onClick={()=> handleNewAddressButton('close')}>
                      Cancel
                  </button>
                </div>
            }
          </div>
        </div>
        <div className='col-md-4 ml-3 mt-3'
        style={{backgroundColor:'whitesmoke'}}
        >
          {
            checkoutProductData.length>0?
              <div>    
                <div><strong>Subtotal: </strong>{subTotal}</div>
                <div><strong>Delivery Charges: </strong>{deliveryCharge}</div>
                <hr />
                <div><strong>Total: </strong>{total}</div>
                <hr />
                <button 
                  className="btn btn-warning"  
                  style={{marginLeft:"25%", padding:"1% 10%", borderRadius:"20px"}}
                  onClick={handleProceedToPayment}>
                    Proceed to Pay
                </button> 
              </div>:
              null
          }
        </div>
      </div>
    </React.Fragment>
  )
}

export default ViewCheckout;