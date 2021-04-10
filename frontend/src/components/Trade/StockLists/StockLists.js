import React, {useEffect, useState} from 'react'
import tradeService from '../../../services/trade'
import {Link} from 'react-router-dom'
import './lists.css'

const StockLists = ({user})=>{

    const [stockLists, setLists] = useState([])
    

    useEffect(()=>{
        const fetchData = async()=>{
            const result = await tradeService.getStockLists()
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
                            <div key={list.id} className='card' style={{width: '18rem'}}>
                                <div className='card-body'>
                                    <h3 className='card-title'>{list.title}</h3>
                                </div>
                                <div className='list-group list-group-flush'>
                                    {list.stocks.map(stonk=>{
                                        const dest = {
                                            pathname: '/dashboard',
                                            param1: `${stonk}`
                                        }
                                        return(
                                            <Link key={stonk} to={dest} className='list-group-item list-group-item-action'>
                                                {stonk}
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
        <div className='main_wrapper'>
            {user &&
                <div>
                    <p className='header'>My stock lists:</p>
                    <Lists />
                </div>
            }

        </div>
    )
}

export default StockLists
