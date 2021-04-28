import React, {useEffect, useState} from 'react'
import tradeService from '../../../services/trade'
import Helper from '../../../services/Helper'
import './style.css'


const StockRow = ({ticker}) => {

    const [initChange, setInitChange] = useState()
    const [price, setPrice] = useState(0)

    useEffect(()=>{
        const fetchInitialPrice = async()=>{
            
            const response = await tradeService.getTickerPrice(ticker)
            const price = response.price
            setPrice(price)
            setInitChange(response.changePercent)
        }

        fetchInitialPrice()
    }, [])

    const changeStyle = ()=>{
        const changeColor = initChange > 0 ? 'green' : 'red'

        return {
            color: changeColor, 
            fontSize: '0.8rem'
        }
    }

    return (
        <div className='row stock-row'>
            <div className='col-sm'>{ticker}</div>
            <div className='col-sm'>${Helper.formatPrice(price)}</div>
            <div className='col-sm' style={changeStyle()}>{Number(100*initChange).toFixed(2)}%</div>
        </div>
    )
} 

export default StockRow