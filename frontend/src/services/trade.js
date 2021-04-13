import axios from 'axios'
import Cookies from 'js-cookie'
import {iex} from '../config/iex'

const baseURL = 'http://localhost:8000/'
const apiURL = `${baseURL}api/`


const getStockLists = async () => {
    const token = JSON.parse(Cookies.get('user'))['token']
    const config = {
        headers: {Authorization: `${token}`}
    }
    const response = await axios.get(`${apiURL}lists/get_lists`, config)
    return response.data
}

const getListData = async (title) => {
    const token = JSON.parse(Cookies.get('user'))['token']
    const config = {
        headers: {Authorization: `${token}`}
    }
    const response = await axios.get(`${apiURL}lists/get_list/${title}`, config)
    return response.data
}

const addList = async (payload)=> {
    const token = JSON.parse(Cookies.get('user'))['token']
    const config = {
        headers: {Authorization: `${token}`}
    }
    const url = `${apiURL}lists/addlist`
    const response = await axios.post(url, payload, config)
    return response.data
}

const deleteList = async (id)=>{
    const url = `${apiURL}lists/delete/${id}`
    const response = await axios.delete(url)
    return response.data
}

const getTickerPrice = async (ticker) => {
    const url = `${iex.baseURL}/stock/${ticker}/quote?token=${iex.api_token}`
    const response = await axios.get(url)

    const data = {
        price: response.data.latestPrice,
        changePercent: response.data.changePercent
    }

    return data 
}

const listAction = async (action, data) => {
    switch(action){
        case 'ADD':
            return addList(data)
        case 'DELETE':
            return deleteList(data)
        case 'GET_ALL_LISTS':
            return getStockLists()
        case 'GET_LIST_DATA':
            return getListData(data)
        default:
            return null;
    }
}

const getTickerData = async (ticker, tickerView) => {
    switch(tickerView){
        case 'Overview':
            return getTickerOverview(ticker)
        case 'News':
            return getTickerNews(ticker)
        case 'Stats':
            return getTickerStats(ticker)
        default:
            return null 
    }
}

const getTickerStats = async(ticker)=>{
    const url = `${iex.baseURL}/stock/${ticker}/stats?token=${iex.api_token}`
    const response = await axios.get(url)
    return response.data
}

const getHeader = async (ticker) => {
    const logoURL = `${iex.baseURL}/stock/${ticker}/logo?token=${iex.api_token}`
    const companyName = `${iex.baseURL}/stock/${ticker}/company?token=${iex.api_token}`

    const logoResponse = await axios.get(logoURL)
    const nameResponse = await axios.get(companyName)

    const data = {
        logo: logoResponse.data['url'],
        name: nameResponse.data['companyName']
    }

    return data
}

const getTickerOverview = async (ticker) => {
    const url = `${iex.baseURL}/stock/${ticker}/company?token=${iex.api_token}`
    const response = await axios.get(url)
    return response.data
}

const getTickerNews = async (ticker) => {
    const url = `${iex.baseURL}/stock/${ticker}/news/last/10?token=${iex.api_token}`
    const response = await axios.get(url)
    console.log(response.data)
    return response.data
}

export default {getTickerData, listAction, addList, deleteList, getListData, getTickerPrice, getHeader, getStockLists}
