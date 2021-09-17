import React from "react";
import '../index.css';

const Address = (props) => {

return (
<div className="row">
  <div className='col-md-12'>
    <div className="card mb-2" onClick={()=> props.clickedAddress(props.addressData.address_id)}>
        <div className='card-body' style={{padding:"3%"}}>
            <div className="card-text">
                <input type="radio" checked={props.addressData.is_default == 1}/>
                <p>
                    <strong>
                        {props.addressData.name} {props.addressData.contact}    
                    </strong>
                    <span style={{float:"right"}} 
                    onClick={()=>props.handleRemoveAddress(props.addressData.address_id)}>
                        <u style={{color:"blue"}}>Remove Address</u>
                    </span>
                </p>
                <span>
                {props.addressData.address}
                </span>
            </div>
        </div>
    </div>
  </div>
</div>

)
}

export default Address;
