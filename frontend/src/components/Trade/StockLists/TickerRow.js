import React, {useEffect, useState} from 'react'
import Helper from '../../../services/Helper'
import tradeService from '../../../services/trade'

const TickerRow = ({ticker, edit, handleDelete})=>{
    const [tickerData, setTickerData] = useState([])

    const changeStyle = () => {
        const changeColor = tickerData.changePercent > 0 ? 'green' : 'red'
        
        return {
            color: changeColor, 
            fontSize: '0.8rem'
        }
    }

    useEffect(()=>{
        const fetchData = async ()=>{
            // Retrieve ticker data
            const response = await tradeService.getTickerPrice(ticker)
            setTickerData(response) 
        }

        fetchData()
    }, [])

    return(
        <tr style={{backgroundColor: 'white', color: 'black'}}>
            <td>{ticker}</td>
            <td>$<span> </span>{tickerData.price}</td>
            <td style={changeStyle()}><span> </span>{Helper.formatChangePercent(tickerData.changePercent)}%</td>
            {edit &&
                <td>
                    <button onClick={()=>handleDelete(ticker)} className='btn btn-danger'>Delete</button>
                </td>
            }
        </tr>
    )
}

export default TickerRow