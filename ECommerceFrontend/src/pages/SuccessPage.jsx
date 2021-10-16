import React, { useEffect} from 'react';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Image from './tick.gif';
import Footer from '../components/Footer';

const SuccessPage = () =>{
    const history = useHistory();
    const [cookies, setCookie] = useCookies(['PMartSecrete']);

    useEffect(()=>{
    if(!cookies.Token) history.push("/login");
    }, [])

    const handleMoveOrder=()=>{
        history.push('/myorder')
    }

    return(
        <React.Fragment>
            <Header/>
                {/* <div class="layered-image"> */}
                    <div className="container-fluid">
                        <h2 className="text-center">
                           Hurray!! Your Order is Placed Successfully! 
                        </h2>
                        <div 
                        onClick={handleMoveOrder}
                        style={{float:"right",fontSize:"larger",marginRight:"5%"}}
                        id="link"
                        >
                           <u> Check order status</u>
                        </div>
                        <br/>
                        <div style={{textAlign:"center",marginTop:"2%"}}>
                            <img style={{height:"25%",width:"25%",paddingBottom:"5%"}} src={Image} alt='success Image'></img>
                        </div><br/>
                    </div>
                {/* </div> */}
            <Footer/>    
        </React.Fragment>
    )
}

export default SuccessPage;