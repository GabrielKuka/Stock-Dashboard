import React, {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {changeListen, setTickers} from '../../reducers/socketReducer'

const Test = ()=>{
    const dispatch = useDispatch()
    const [price, setPrice] = useState()
    const tickers = ['SPY', 'QQQ', 'DIA']

    useEffect(()=>{
            dispatch(changeListen('listen'))
            dispatch(setTickers(tickers))
        return ()=>{
            // unlisten                
            dispatch(changeListen('unlisten'))
            dispatch(setTickers([]))
        }
    },[])

    return(<div>
    </div>)
}

export default Test 