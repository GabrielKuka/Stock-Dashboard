import React, {useEffect, useState, useContext} from 'react'
import {useSelector} from 'react-redux'
import tradeService from '../../../services/trade'
import {WebSocketContext} from '../../Test/websocket'
import Helper from '../../../services/Helper'
import './style.css'


const TopListItem = ({ticker, issueType})=>{
    const [tickerData, setTickerData] = useState()

    const ws = useContext(WebSocketContext)

    const stock = useSelector(({socket})=>socket)

    const changeStyle = ()=>{
        const changeColor = tickerData.changePercent > 0 ? 'green' : 'red'
        return { color: changeColor, fontSize: '0.9rem',}
    }

    // Retrieve initial data
    useEffect(()=>{
        const fetchPrice = async ()=>{
            const response = await tradeService.getTickerPrice(ticker)
            setTickerData(response)
        }

        fetchPrice()

        ws.subscribe(ticker)

        return ()=> {
            setTickerData([]) 
            ws.unsubscribe(ticker)}
    },[])

    // Check socket updates
    useEffect(()=>{
        if(stock.ticker === ticker){
            setTickerData(oldData=>({...oldData, price: stock.price}))
        }
    },[stock.price])

    return(
        <div className='nav-item active toplist-item'>
                <div className='container toplist-item-container'>
                    <span className='ticker'>{ticker}</span>
                    <span className='toplist-issuetype'>{Helper.formatIssueType(issueType)}</span>
                </div>
                {tickerData && 
                    <div className='container toplist-item-container'>
                        <span>${tickerData && tickerData.price}</span>
                        <p></p>
                        <span style={changeStyle()}>{tickerData && tickerData.changePercent}%</span>
                    </div>
                }
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