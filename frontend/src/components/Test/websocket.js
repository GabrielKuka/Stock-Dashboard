import React, {createContext} from 'react'
import {finnhub} from '../../config/finnhub'
import {updateData} from '../../reducers/socketReducer'
import {useDispatch} from 'react-redux'
import Helper from '../../services/Helper'

const WebSocketContext = createContext(null)

export {WebSocketContext}

const ENDPOINT = finnhub.socket_base_url.concat(`?token=${finnhub.api_key}`) 

export default ({children})=>{
    let socket;
    let ws;
    const dispatch = useDispatch()

    const subscribe = (ticker)=>{
        const payload = {
            'type':'subscribe',
            'symbol': `${ticker}`
        }
        waitForConnection(()=>socket.send(JSON.stringify(payload)))
    }

    const unsubscribe = (ticker)=>{
        const payload = {
            'type':'unsubscribe',
            'symbol': `${ticker}`
        }
        waitForConnection(()=>socket.send(JSON.stringify(payload)))
    }

    if (!socket){
        socket = new WebSocket(ENDPOINT) 

        socket.onopen = ()=>console.log('Connection opened')

        socket.onmessage = (msg)=>{
            const message = JSON.parse(msg.data)
            if(typeof message.data !== 'undefined' && typeof message.data[0].s !== 'undefined'){
                const symbol = message.data[0].s
                const price = Helper.formatPrice(message.data[0].p)
                dispatch(updateData({ticker: symbol, price: price})) 
            }
        }

        socket.onclose = ()=>console.log('Connection CLosed')

        ws = {
            socket: socket,
            subscribe,
            unsubscribe
        }
    }

    const waitForConnection = (callback)=>{
        if(socket.readyState === 1){
            callback()
        }else {
            setTimeout(()=>waitForConnection(callback), 500)
        }
    }

    return (
        <WebSocketContext.Provider value={ws}>
            {children}
        </WebSocketContext.Provider>
    )

}