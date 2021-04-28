import React from 'react'

import LoggedOut from './LoggedOut'
import StockLists from '../Trade/StockLists/StockLists'


import './style.css'

const Profile = ({user})=>{

    if(!user){
        return <LoggedOut/>
    }

    return(
        <div className='row profile-wrapper'>
            <div className='col-md-4'>
                <div className='card profile-data shadow p-3 mb-5 '>
                    <div className='card-body'>
                        <h2 className='card-title'>{user.name}</h2>
                        <div>
                            {user.email}<br/>
                            Here, we are going to find user data
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-md-8'>
                <div className='card trades-watchlists shadow p-3 mb-5 rounded'>
                    <div className='card-body'>
                        <p className='card-title'>Trades</p>
                        <div>
                            Here we are going to list trades performed by the user
                        </div>
                    </div>
                </div>
                <StockLists user={user} />
            </div>
        </div>
    )
}

export default Profile