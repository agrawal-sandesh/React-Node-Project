import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import '../index.css';
import { useCookies } from 'react-cookie';
import Header from '../components/Header';

const MyProfile = () =>{
  const history = useHistory();
  const [cookies, setCookie] = useCookies(['PMartSecrete']);
  const [customerData, setCustomerData] = useState([]);

    useEffect(()=>{
        if(!cookies.Token) history.push("/login");
        getCustomerData()
    },[])

    const getCustomerData=()=>{
        axios.post('http://localhost:4000/address', {
            customerId: cookies.Token.customer_id
            })
            .then(response=> {
            if(response.data.status === 'success'){
                setCustomerData(response.data.res[0])
            }else{
                alert('Details not found')
            }
            })
            .catch(function (error) {
            alert(error.message);
            });
      }

  return (
    <React.Fragment>
    <Header/>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8 mt-4 offset-2">        
            <form 
              style={{  
                padding: "5%", 
                backgroundColor:"white"
              }}
            >
              <h1 className="text-black text-center" style={{cursor:"context-menu"}}>Personal Information</h1>
              <div className="form-group">
                  Name:
                  <input 
                    className="form-control"
                    disabled
                    value={customerData.name}
                    id="input2"
                    style={{cursor:"no-drop"}}
                  />
                </div>

                <div className="form-group">
                  Email:
                  <input 
                    className="form-control"
                    disabled
                    value={customerData.email}
                    id="input2"
                    style={{cursor:"no-drop"}}
                  />
                </div>
              <div className="form-group">
                  Contact:
                  <input 
                  className="form-control"
                  disabled
                  value={customerData.contact}
                  id="input2"
                  style={{cursor:"no-drop"}}
                  />
              </div>
              <div className="form-group">
                  Address:
                  <input 
                  className="form-control"
                  disabled
                  value={customerData.address}
                  id="input2"
                  style={{cursor:"no-drop"}}
                  />
              </div>
            
            </form>
            </div>
        </div>
      </div>
    </React.Fragment>
  );
}
export default MyProfile;
