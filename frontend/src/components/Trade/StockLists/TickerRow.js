import React, {useEffect, useState, useContext, useRef} from 'react'
import {WebSocketContext} from '../../Test/websocket'
import {useSelector} from 'react-redux'
import Helper from '../../../services/Helper'
import tradeService from '../../../services/trade'

const TickerRow = ({ticker, edit, listAction})=>{

    const stock = useSelector(({socket})=>socket); 
    const ws = useContext(WebSocketContext)

    const [tickerData, setTickerData] = useState([])
    const prevClose = useRef()

    const changeStyle = () => {
        const changeColor = tickerData.changePercent > 0 ? 'green' : 'red'
        
        return { color: changeColor, fontSize: '0.8rem'}
    }

    // Retrieve initial data
    useEffect(()=>{
        const fetchData = async ()=>{
            const response = await tradeService.getTickerPrice(ticker)
            // Save change percent, price, and prev price
            setTickerData(response) 
            prevClose.current = response.previousClose
        }

        fetchData()

        ws.subscribe(ticker)

        return ()=>{
            setTickerData([])
            ws.unsubscribe(ticker)
        }
    }, [])

    // Check socket updates
    useEffect(()=>{
        if(stock.ticker===ticker){
            const change = Helper.formatPrice(stock.price - prevClose.current)
            setTickerData({
                price: stock.price, 
                change: change, 
                changePercent: Helper.formatChangePercent(change/prevClose.current)
            })
        }
    },[stock.price])

    return(
        <>
        {tickerData && 
            <tr>
                <td>{ticker}</td>
                <td>$ {tickerData.price}</td>
                <td style={changeStyle()}>
                    {tickerData.changePercent}%
                    ({tickerData.change})
                </td>
                {edit &&
                    <td>
                        <button onClick={()=>listAction({type:'REMOVE_STOCK', data:ticker})} 
                                className='btn btn-danger'>X</button>
                    </td>
                }
            </tr>
        }
        </>
    )
}

export default TickerRow