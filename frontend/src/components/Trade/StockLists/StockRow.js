import React, {useEffect, useState} from 'react'
import tradeService from '../../../services/trade'

import './style.css'

const StockRow = ({ticker}) => {

    const [data, setPrice] = useState([])

    useEffect(()=>{
        const fetchPrice = async()=>{
            // Make request here
            const response = await tradeService.getTickerPrice(ticker) 
            setPrice(response)
        }

        fetchPrice()
    }, [])

    const changeStyle = ()=>{
        const changeColor = data.changePercent > 0 ? 'green' : 'red'

        return {
            color: changeColor, 
            fontSize: '0.8rem'
        }
    }

    return (<div className='row'>
        <div className='col-sm'>{ticker}</div>
        <div className='col-sm'>${data.price}</div>
        <div className='col-sm' style={changeStyle()}>{Number(100*data.changePercent).toFixed(2)}%</div>
    </div>)
} 

export default StockRow