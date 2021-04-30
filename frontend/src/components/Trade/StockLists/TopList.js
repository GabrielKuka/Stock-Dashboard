import React, {useEffect, useState} from 'react'
import tradeService from '../../../services/trade'
import Helper from '../../../services/Helper'
import './style.css'

const TopListItem = ({ticker, issueType})=>{
    const [initChange, setInitChange] = useState()
    const [stockData, setStockData] = useState()

    // Retrieve stock data like price
    useEffect(()=>{
        const fetchPrice = async ()=>{
            const response = await tradeService.getTickerPrice(ticker)
            setInitChange(response.changePercent)
            setStockData(response)
        }

        fetchPrice()
    },[])

    const itemStyle={
        color: 'white',
        border: '1px solid yellow',
        borderRadius: '0.7rem',
        title:{
        },
        issueType: {
            fontSize: '0.8rem',
        }
    }

    const changeStyle = ()=>{
        const changeColor = initChange > 0 ? 'green' : 'red'
        return {
            color: changeColor, 
            fontSize: '0.9rem',
        }
    }

    return(
        <div className='col-md-4' style={itemStyle}>
                <div className='row'>
                    <span className='col-md-6'>{ticker}</span>
                    <span className='col-md-4'></span>
                    <span className='col-md-2' style={itemStyle.issueType}>{Helper.formatIssueType(issueType)}</span>
                </div>
                <div className='row'>
                    <span className='col-md-6'>${stockData && stockData.price}</span>
                    <span className='col-md-3'></span>
                    <span className='col-md-3' style={changeStyle()}>{stockData && Helper.formatChangePercent(stockData.changePercent)}%</span>
                </div>
        </div>
    )
}

const TopList = ({user})=>{

    const [listItems, setListItems] = useState([])

    // Retrive toplist data
    useEffect(()=>{
        const fetchTopList = async()=>{
            const response = await tradeService.topListAction('GET')
            setListItems(response.stocks)
        }

        fetchTopList()
    },[])

    return(
        <div className='navbar-nav ml-auto row toplist-wrapper'>
            {listItems && listItems.map(stock=>{
                return <TopListItem ticker={stock.ticker} issueType={stock.issueType} />
            })}
        </div>
    )   
}

export default TopList