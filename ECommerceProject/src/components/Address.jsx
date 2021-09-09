import React from "react";
import '../index.css';

const Address = (props) => {
return (
<div className="row">
  <div className='col-md-12'>
    <div className="card" style={{margin:"3%"}}>
        <div className='card-header bg-primary'>
            <h4 style={{color:"white"}}> DELIVERY ADDRESS</h4>
        </div>
        <div className='card-body' style={{padding:"3%"}}>
            <div className="card-text">
            <h5>
                {props.addressData.name} {props.addressData.contact}    
            </h5> <br/>
            <span>
            {props.addressData.address}
            </span><hr/>
            </div>
        </div>
        <button>
            ADD A NEW
        </button>
    </div>
  </div>
</div>

)
}

export default Address;
