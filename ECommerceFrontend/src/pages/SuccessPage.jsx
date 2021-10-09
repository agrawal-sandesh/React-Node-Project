import React, { useEffect} from 'react';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import Header from './Header';

const SuccessPage = () =>{
    const history = useHistory();
    const [cookies, setCookie] = useCookies(['PMartSecrete']);

    useEffect(()=>{
    if(!cookies.Token) history.push("/login");
    }, [])

    return(
        <React.Fragment>
            <Header/>
                <div className="container-fluid">
                    <h1>
                    The order is placed successfully!
                    </h1>
                </div>
        </React.Fragment>
    )
}

export default SuccessPage;