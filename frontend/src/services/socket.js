import {useState} from 'react'
import {createContext} from 'react'
import {alpaca, auth_data} from '../config/alpaca'
import {useDispatch} from 'react-redux'
import {updateData} from '../reducers/socketReducer'

const WebSocketContext = createContext(null)

const socket = new WebSocket(`${alpaca.baseStreamURL}`)

export {WebSocketContext}

export default ({children})=>{
    var ws;

    const dispatch = useDispatch()

    const waitForConnection = (callback, interval)=>{
        if(socket.readyState === 1){
            callback() 
        }else {
            setTimeout(()=>{waitForConnection(callback, interval)}, interval)
        }
    }

    const listen = (ticker)=>{
        const listen_data = {
            "action": "listen",
            "data" : {
                "streams": [`Q.${ticker}`]
            }
        }
        waitForConnection(()=>{
            socket.send(JSON.stringify(listen_data))
        }, 1000)
    }

    const unlisten = (ticker)=>{
        const unlisten_data =  {
            "action": "unlisten",
            "data" : {
                "streams": [`Q.${ticker}`]
            }
        }
        waitForConnection(()=>{
            socket.send(JSON.stringify(unlisten_data))
        }, 1000)
    }

    if(socket){
        socket.onopen = function(){
                console.log('Socket Opened')
                socket.send(JSON.stringify(auth_data))
        }

        socket.onmessage = (msg) => {
            const message = JSON.parse(msg.data)
            if(message.data.status === 'authorized'){
                console.log('Connected to Alpaca')
            }else {
                console.log(message.data.p)
                const ticker = message.data.T
                const price = message.data.p
                const data = {ticker: price}
                dispatch(updateData(data))
            }
        }

        socket.onclose = function(){
            console.log('Socket Closed')
        }

        ws = {
            socket: socket,
            listen,
            unlisten,
        }
    }

    return (
        <WebSocketContext.Provider value={ws}>
            {children}
        </WebSocketContext.Provider>
    )

}