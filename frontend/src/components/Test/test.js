import React, {useEffect, useContext} from 'react'
import {WebSocketContext} from '../../services/socket'
import {useSelector} from 'react-redux'

import socketReducer from '../../reducers/socketReducer'

const Test = ()=>{
    const ticker = 'SPY' 

    const ws = useContext(WebSocketContext) 
    const price = useSelector(({socket})=>socket.tickers.price)

    console.log(price)

    useEffect(()=>{
            ws.listen(ticker)
        return ()=>{
            // unlisten                
            ws.unlisten(ticker)
        }
    },[])

    return(<div>
    </div>)
}

export default Test 