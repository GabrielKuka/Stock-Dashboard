import React, {useState, useMemo, useCallback, useRef} from 'react'
import tradeService from '../../services/trade'
import {alpaca, auth_data} from '../../config/alpaca'
import useWebSocket, {ReadyState} from 'react-use-websocket'

const Test = ()=>{

    const [socketURL, setSocketURl] = useState(`${alpaca.baseStreamURL}`)
    const messageHistory = useRef([])

    const {
        sendMessage,
        lastMessage,
        readyState,
    } = useWebSocket(socketURL, {
        onOpen: ()=> console.log('Socket open'),
        onMessage : (msg)=> console.log(JSON.parse(msg.data)),
        onClose : () => console.log('Socket Closed'),
        shouldReconnect: (closeEvent)=>true,
    })


    return(<div>
    </div>)
}

export default Test 