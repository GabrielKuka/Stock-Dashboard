import React, {useEffect, useState} from 'react'
import tradeService from '../../../services/trade'
import {Link} from 'react-router-dom'
import './style.css'

import StockRow from './StockRow'

const StockLists = ({user})=>{

    const [stockLists, setLists] = useState([])
    
    useEffect(()=>{
        const fetchData = async()=>{
            const result = await tradeService.listAction('GET_ALL_LISTS')
            setLists(result)
        }
        fetchData()
    }, [])

    const Lists = ()=>{

        return (
            <div className='card-columns'>
                {stockLists && 
                    stockLists.map(list=>{
                        return(
                            <div key={list.id} className='card shadow p-3 mb-5 rounded' style={{width: '16em'}}>
                                <Link className='card-body' to={'/stocklist/' + list.title}>
                                    <h2 className='card-title'>{list.title}</h2>
                                </Link>
                                <div className='list-group list-group-flush'>
                                    {list.stocks.map(stonk=>{
                                        const dest = {
                                            pathname: '/dashboard',
                                            param1: `${stonk}`
                                        }
                                        return(
                                            <Link key={stonk} to={dest} className='list-group-item list-group-item-action'>
                                                <StockRow ticker={stonk} /> 
                                            </Link>
                                    )})}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    return(
        <div className='main_wrapper body'>
            {user &&
                <div>
                    <p className='header'>
                       <Link className='btn btn-outline-dark' to='/createlist'>+</Link><span> </span>
                        My stock lists:
                        </p>
                    <Lists />
                </div>
            }

        </div>
    )
}

export default StockLists
