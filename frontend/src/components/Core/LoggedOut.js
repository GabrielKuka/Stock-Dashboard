import React from 'react'
import {Link} from 'react-router-dom'

const LoggedOut = () => {

    return (
        <div className='loggedOut'>
            <h1>You logged out!</h1>

            <Link to='/login'>< button className='btn btn-primary' variant='contained' color='primary' >Click here to login</button></Link>
        </div>
    )
}

export default LoggedOut;
