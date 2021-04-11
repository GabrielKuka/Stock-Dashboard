import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useLocation} from 'react-router-dom'
import tradeService from '../../../services/trade'

import LoggedOut from '../../Core/LoggedOut'

const StockList = ()=>{

    const title = useLocation().param1
    const user = useSelector(({user})=>user)
    const [listData, setListData] = useState([])

    useEffect(()=>{
        const fetchData = async()=>{
           // Retrieve stock list data 
           const response = await tradeService.getListData(title) 
           setListData(response)
        }

        fetchData()
    }, [])

    if(!user){
        return <LoggedOut />
    }

    return (
        <div className='container fluid'>
            <div className='card' style={{marginTop: '2rem'}}>
                <h2 className='card-title'>{title}</h2>
                <div className='card-body'>
                    <table class='table table-bordered table-sm table-hover'>
                        <thead className='table-dark'>
                            <tr>
                                <td>Stock</td>
                                <td>Price</td>
                            </tr>
                        </thead>
                        <tbody>
                            {listData.stocks.map(stock=>{
                                return (
                                    <tr>
                                        <td>{stock}</td>
                                        <td>price</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )

}

export default StockList