import React from 'react'
import { useSelector } from 'react-redux';


const CustomAlert = () => {

    const alert = useSelector(({alert})=>alert)
    if(alert.text){
       return (
        <>
        {
        alert.error 
        ?  
        <div className="alert alert-danger" role="alert">            
            {alert.text}
        </div>

        : 
        <div className="alert alert-success" role="alert">            
            {alert.text}
        </div>
        }
        </>
       )
    }
    return null
}

export default CustomAlert;
