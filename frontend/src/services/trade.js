import axios from 'axios'
import Cookies from 'js-cookie'
import {iex} from '../config/iex'
import Helper from './Helper'

const baseURL = 'http://localhost:8000/'
const apiURL = `${baseURL}api/`

// ~+~+~+~+~+~++~+~+~+~+~+~ List action functions
const listAction = async (action, data) => {
    switch(action){
        case 'ADD':
            return addList(data)
        case 'DELETE':
            return deleteList(data)
        case 'UPDATE':
            return editList(data)
        case 'GET_ALL_LISTS':
            return getStockLists()
        case 'GET_LIST_DATA':
            return getListData(data)
        case 'CHECK_TITLE':
            return isTitleValid(data)
        default:
            return null;
    }
}

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

const editList = async (payload)=>{
    const token = JSON.parse(Cookies.get('user'))['token']
    const config = {
        headers: {Authorization: `${token}`}
    }
    const url = `${apiURL}lists/editlist/${payload['id']}`
    const response = await axios.put(url, payload, config)
    return response.data
}

const deleteList = async (id)=>{
    const url = `${apiURL}lists/delete/${id}`
    const response = await axios.delete(url)
    return response.data
}

// ~+~+~+~+~+~++~+~+~+~+~+~ Top List functions
const topListAction = (action, data)=>{
    switch(action){
        case 'GET':
            return getTopList()
        case 'UPDATE':
            return editTopList(data)
        case 'DELETE':
            return deleteTopList()
        default:
            return null
    }
}

const getTopList = async ()=>{
    const token = JSON.parse(Cookies.get('user'))['token']
    const config = {
        headers: {Authorization: `${token}`}
    }

    const url = `${apiURL}lists/toplist/gettoplist`
    const response = await axios.get(url, config)
    return response.data
}

const editTopList = async (payload)=>{
    const token = JSON.parse(Cookies.get('user'))['token']
    const config = {
        headers: {Authorization: `${token}`}
    }
    const url = `${apiURL}lists/toplist/edittoplist`
    const response = await axios.put(url, config, payload)
    return response.data
}

const deleteTopList = async ()=>{
    const token = JSON.parse(Cookies.get('user'))['token']
    const config = {
        headers: {Authorization: `${token}`}
    }
    const url = `${apiURL}lists/toplist/deletetoplist`
    const response = axios.delete(url, config)
    return response.data
}


// ~+~+~+~+~+~++~+~+~+~+~+~ Ticker functions
const getPreviousDayPrice = async(ticker)=>{
    const url = `${iex.baseURL}/stock/${ticker}/previous?token=${iex.api_key}`

    const response = await axios.get(url)
    return response.data
}
const getTickerPrice = async (ticker) => {
    const url = `${iex.baseURL}/stock/${ticker}/quote?token=${iex.api_key}`
    const response = await axios.get(url)
    const data = {
        price: response.data.latestPrice,
        changePercent: Helper.formatChangePercent(response.data.changePercent),
        previousClose: response.data.previousClose,
        change: Helper.formatPrice(response.data.latestPrice - response.data.previousClose)
    }

    return data 
}

const getTickerQuote = async (ticker) => {
    const url = `${iex.baseURL}/stock/${ticker}/quote?token=${iex.api_key}`
    const response = await axios.get(url)

    return response.data
}

const getTickerIssueType = async(ticker)=>{
    const data = await getTickerOverview(ticker)

    return data.issueType 
}

const isTitleValid = async (title)=>{
    const token = JSON.parse(Cookies.get('user'))['token']
    const config = {
        headers: {Authorization: `${token}`}
    }
    const url = `${apiURL}lists/checktitle/${title}`
    const response = await axios.get(url, config)
    return response.data
}

// ~+~+~+~+~+~++~+~+~+~+~+~ Dashboard functions
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

const getTickerOverview = async (ticker) => {
    const url = `${iex.baseURL}/stock/${ticker}/company?token=${iex.api_key}`
    const response = await axios.get(url)
    return response.data
}

const getTickerStats = async(ticker)=>{
    const url = `${iex.baseURL}/stock/${ticker}/stats?token=${iex.api_key}`
    const response = await axios.get(url)
    return response.data
}

const getTickerNews = async (ticker) => {
    const url = `${iex.baseURL}/stock/${ticker}/news/last/10?token=${iex.api_key}`
    const response = await axios.get(url)
    console.log(response.data)
    return response.data
}

const getHeader = async (ticker) => {
    const logoURL = `${iex.baseURL}/stock/${ticker}/logo?token=${iex.api_key}`
    const companyName = `${iex.baseURL}/stock/${ticker}/company?token=${iex.api_key}`

    const logoResponse = await axios.get(logoURL)
    const nameResponse = await axios.get(companyName)

    const data = {
        logo: logoResponse.data['url'],
        name: nameResponse.data['companyName']
    }

    return data
}

export default {getTickerData, 
    getTickerIssueType, 
    getPreviousDayPrice,
    getTickerQuote,
    topListAction, 
    listAction, 
    getTickerPrice, 
    getHeader}
