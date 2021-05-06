import React, {useContext, useEffect, useState} from 'react'
import { WebSocketContext } from './websocket'

const Test = ()=>{

    const ticker = 'AAPL'
    const [price, setPrice] = useState(0)

    const ws = useContext(WebSocketContext)

    useEffect(()=>{
        const subscribe = async ()=>{
            ws.subscribe(ticker)
        }

        subscribe()
        ws.socket.onmessage = (msg)=>{
            const message = JSON.parse(msg.data)
            //console.log(message.data)
            if(typeof message.data !== 'undefined'){
                const symbol = message.data[0].s
                setPrice(price)
                if(symbol===ticker){
                    const price = message.data[0].p
                    setPrice(price)
                }
            }
        }

        return ()=>{
            ws.unsubscribe(ticker)
        }
    }, [])

    return (
        <div>
           {price} 
        </div>
    )
}

export default Test