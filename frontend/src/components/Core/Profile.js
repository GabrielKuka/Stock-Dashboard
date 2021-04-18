import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'

import LoggedOut from './LoggedOut'
import StockLists from '../Trade/StockLists/StockLists'

import tradeService from '../../services/trade'

import './style.css'

const Profile = ({user})=>{

    const [stockLists, setLists] = useState([])

    useEffect(()=>{
        const fetchData = async()=>{
            const result = await tradeService.listAction('GET_ALL_LISTS')
            console.log(result)
            setLists(result)
        }
        fetchData()
    }, [])

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
                            PrLorem Ipsum is simply dummy text of the printing and typesetting industry. 
                            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when 
                            an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                            It has survived not only five centuries, but also the leap into electronic typesetting, 
                            remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset 
                            sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus 
                            PageMaker including versions of Lorem Ipsum.ofile Data goes here
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-md-8'>
                <div className='card trades-watchlists shadow p-3 mb-5 rounded'>
                    <div className='card-body'>
                        <p className='card-title'>Trades</p>
                        <div>
                            It is a long established fact that a reader will be distracted by the readable content of a page 
                            when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal 
                            distribution of letters, as opposed to using 'Content here, content here', making it look like readable 
                            English. Many desktop publishing packages and 
                            web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' 
                            will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes 
                            by accident, sometimes on purpose (injected humour and the like).
                        </div>
                    </div>
                </div>
                <StockLists user={user} />
            </div>
        </div>
    )
}

export default Profile