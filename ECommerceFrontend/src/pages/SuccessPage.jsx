import React, { useEffect} from 'react';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Image from '../success-tick.gif'
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
                    <div className="container-fluid">
                        <p className="h2 text-center mt-3">
                           Your Order is Placed Successfully! 
                        <div className="mt-3"
                            onClick={handleMoveOrder}
                            style={{
                                float:"right",
                                fontSize:"large",
                                marginRight:"1%",
                                textDecorationLine: "underline",
                            }}
                            id="link"
                        >
                           Check order status
                        </div>
                        </p>
                        <br/>
                        <div style={{textAlign:"center",marginTop:"2%"}}>
                            <img style={{height:"25%",width:"25%",paddingBottom:"5%"}} src={Image} alt='success Image'></img>
                        </div><br/>
                    </div>
            <Footer/>    
        </React.Fragment>
    )
}

export default SuccessPage;