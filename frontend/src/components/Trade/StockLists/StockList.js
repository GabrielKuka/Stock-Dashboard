import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useParams, useHistory} from 'react-router-dom'
import tradeService from '../../../services/trade'
import LoggedOut from '../../Core/LoggedOut'

import TickerRow from './TickerRow'

import './style.css'


const StockList = ()=>{

    const history = useHistory()
    const title = useParams().title
    const user = useSelector(({user})=>user)
    const [tickerList, setTickerList] = useState([])

    useEffect(()=>{
        const fetchData = async()=>{
           // Retrieve stock list data 
           const response = await tradeService.listAction('GET_LIST_DATA', title)
           setTickerList(response) 
        }

        fetchData()
    }, [])

    if(!user){
        return <LoggedOut />
    }

    const handleDelete = async ()=>{
        const answer = window.confirm('Are you sure you want to delete the list?')
        if(answer){
            try{
                await tradeService.listAction('DELETE', tickerList.id)
                history.push('/lists')
            }catch(exception){
                window.alert('An Error Occurred')
            }
        }
    }

    const handleEdit = () =>{
        history.push(`/editlist/${title}`)
    }

    return (
        <div className='container fluid'>
            <div className='card' style={{marginTop: '2rem'}}>
                <div className='card-body'>
                    <h2 className='card-title'>{title}</h2>
                    <table className='table table-bordered table-sm '>
                        <thead className='table-dark'>
                            <tr key='header'>
                                <td>Stock</td>
                                <td>Price</td>
                                <td>Change</td>
                            </tr>
                        </thead>
                        <tbody>
                            {tickerList.stocks && tickerList.stocks.map(ticker=>{
                               return <TickerRow ticker={ticker} edit={false} key={ticker}/>
                            })}
                        </tbody>
                    </table>
                    <div className='d-flex justify-content-center'>
                        <button className='btn btn-danger' onClick={()=>handleDelete()}>
                            Delete List
                        </button>

                        <button className='btn btn-outline-secondary edit-option' onClick={()=>handleEdit()}>
                            Edit List
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default StockList