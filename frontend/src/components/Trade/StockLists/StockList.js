import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useParams, useHistory} from 'react-router-dom'
import tradeService from '../../../services/trade'

import LoggedOut from '../../Core/LoggedOut'
import TickerRow from './TickerRow'

import './style.css'
import Moment from 'react-moment'


const StockList = ()=>{

    const history = useHistory()
    const user = useSelector(({user})=>user)

    const title = useParams().title
    const [listDates, setListDates] = useState({})
    const [tickerList, setTickerList] = useState([])


    useEffect(()=>{
        const fetchData = async()=>{
           // Retrieve stock list data 
            const response = await tradeService.listAction('GET_LIST_DATA', title)
            setTickerList(response) 
            setListDates({
                'updated_on': response.updated_on,
                'created_on': response.created_on
            })
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
            <div className='card shadow p-2' style={{marginTop: '2rem'}}>
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
                    <div className='d-grid'>
                        <button className='btn btn-danger' onClick={()=>handleDelete()}>
                            Delete List
                        </button>

                        <button className='btn btn-outline-secondary list-option' onClick={()=>handleEdit()}>
                            Edit List
                        </button>
                        <p className='badge bg-info text-light list-badge'>
                            Created <Moment fromNow>{listDates.created_on}</Moment>
                        </p> 
                        <p className='badge bg-success text-light list-badge'>
                            Updated <Moment fromNow>{listDates.updated_on}</Moment>
                        </p> 
                    </div>
                </div>
            </div>
        </div>
    )

}

export default StockList