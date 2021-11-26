import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory} from "react-router-dom";
import { useCookies } from 'react-cookie';
import Address from '../components/Address';
import Header from '../components/Header';
// import Footer from '../components/Footer';

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
      customerId: cookies ? (cookies.Token? cookies.Token.customer_id : '') : ''
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
      customerId: cookies ? (cookies.Token? cookies.Token.customer_id : '') : ''
    })
    .then(response => {
      if(response.data.status === 'success'){
        setAddressData(response.data.res);
      }
      else
        setAddressData([]);
      setErrorMessage(response.data.msg);
    })
    .catch(error => {
      setErrorMessage(error);
    });
  }


  const loadScript = (src)  => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {resolve(true)};
        script.onerror = () => {resolve(false)};
        document.body.appendChild(script);
    });
  }

  async function handleProceedToPayment() {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }
    const result = await axios.post("http://localhost:4000/orders",{
      amount: total
    });
  
    if (!result) {
        alert("Server error. Are you online?");
        return;
    }
    const { amount, id: receipt, currency } = result.data;

    const options = {
        key: "rzp_test_rZ6Kw7FRxiZRsU",
        amount: amount.toString(),
        currency: currency,
        name: "PMart",
        description: "Billing Amount",
        order_id: receipt,
        handler: async function (response) {
          const data = {
              orderCreationId: receipt,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              customerId:cookies.Token.customer_id,
              addressId:addressData[0].address_id,
              totalAmount:total
          };
          const result = await axios.post("http://localhost:4000/success",data);
            if(result.data.status=='success'){         
              history.push('/successpage')
            }
            else{
              alert('something went wrong')
            }
        },
        prefill: {
            email: addressData[0].email,
            contact: addressData[0].contact,
        },
        notes: {
          name: addressData[0].name,
          address: addressData[0].address,
        }
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
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
      <Header/>
      <div className="container-fluid">
        <div className="display-4 ml-4">
            Checkout
        </div>
        <div className="row" >
          <div className='col-md-7 ml-4 mt-4'>
            <div className='card-header' style={{backgroundColor:"#0275d8",
             boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.4)"}}>
            <h5 style={{color:"white"}}>
               DELIVERY ADDRESS
            </h5>
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
                  <button className="btn btn-block btn-primary" 
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
                        id="addressBox"
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
            {
              checkoutProductData.length>0?
              <div className='col-md-4 ml-2 mt-4'
                style={{
                backgroundColor: "white",
                boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.4)",
                padding:"3%",
                paddingBottom:"5%",
                height:"100%"
                }}>
              
              <div style={{fontWeight:"bold",color:"grey"}}>
                PRICE DETAILS
              </div>
              <hr/>
              <div>
                Subtotal <span style={{float:"right"}}>₹{subTotal}</span>
              </div><br/>
              <div>
                Delivery Charges <span style={{float:"right"}}>₹{deliveryCharge}</span>
              </div>
              <hr />
              <div>
                <b>Total Payable <span style={{float:"right"}}>₹{total}</span></b>
              </div>
              <hr />
              <button className="btn btn-success btn-block"  style={{
                padding:"2% 10%",borderRadius:"20px",fontWeight:'bold'}}
                onClick={handleProceedToPayment}>Proceed to Make Payment</button> 
              </div>
              :null
          }    
          </div>
        </div>
      {/* <Footer/>   */}
    </React.Fragment>
  )
}

export default ViewCheckout;