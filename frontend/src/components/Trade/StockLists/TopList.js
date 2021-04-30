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

    const changeStyle = ()=>{
        const changeColor = initChange > 0 ? 'green' : 'red'
        return {
            color: changeColor, 
            fontSize: '0.9rem',
        }
    }

    return(
        <div className='nav-item active toplist-item'>
                <div className='container toplist-item-container'>
                    <span className='ticker'>{ticker}</span>
                    <span className='toplist-issuetype'>{Helper.formatIssueType(issueType)}</span>
                </div>
                <div className='container toplist-item-container'>
                    <span>${stockData && stockData.price}</span>
                    <p></p>
                    <span style={changeStyle()}>{stockData && Helper.formatChangePercent(stockData.changePercent)}%</span>
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
        <div className='navbar-nav ml-auto mr-auto toplist-wrapper'>
            {listItems && listItems.map(stock=>{
                return <TopListItem key={stock.ticker} ticker={stock.ticker} issueType={stock.issueType} />
            })}
        </div>
    )   
}

export default TopList