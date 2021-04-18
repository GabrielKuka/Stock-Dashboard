import {useState} from 'react'
import {alpaca, auth_data} from '../config/alpaca'
import {useSelector, useDispatch} from 'react-redux'
import {changeListen, changeLogin, setTickers} from '../reducers/socketReducer'

const ws = new WebSocket(alpaca.baseStreamURL)

export const Socket = (props)=>{
    const dispatch = useDispatch()
    const loginStatus = useSelector(({socket})=>socket.loginState)
    const tickers = useSelector(({socket})=>socket.tickers)

    ws.onopen = function() {
        console.log('Connected')
        ws.send(JSON.stringify(auth_data))
    }

    ws.onmessage = (event)=>{
        const result = JSON.parse(event.data)
        console.log(result)
        if(result.data.status == 'authorized'){
            console.log('Logged in')
            dispatch(changeLogin(true))
            tickers.map(ticker=>listen(ticker))
        }
        console.log(`$${result.data.p}`)
    }

    ws.onclose = ()=>{
        console.log('Conneciton Closed')
        dispatch(changeLogin(false))
        dispatch(changeListen('unlisten'))
        dispatch(setTickers([]))
    }

    const listen = (ticker)=>{
        ws.send(JSON.stringify(
            {
                "action": "listen",
                "data": {
                    "streams": [`Q.${ticker}`] 
                }
            } 
        ))
    }

    const unlisten = (ticker)=>{
        ws.send(JSON.stringify(
            {
                "action": "unlisten",
                "data": {
                    "streams": [`Q.${ticker}`] 
                }
            } 
        ))
    }

    return null 
}
