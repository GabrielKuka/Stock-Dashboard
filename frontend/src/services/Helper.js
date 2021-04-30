import cts from 'check-ticker-symbol'
import tradeService from '../services/trade'

const Helper = {
    formatChangePercent: (change) => {
        return Number(100*change).toFixed(2)
    }, 
    formatPrice: (price)=>{
        return Number(price).toFixed(2)
    },
    formatDateTime: (date)=>{
        return new Intl.DateTimeFormat("en-GB", {
            year: "numeric",
            month: "long",
            day: "2-digit"
        }).format(date)
    },
    formatBirthday: date => {
        let p = new Intl.DateTimeFormat("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).formatToParts(date).reduce((acc, part)=>{
            acc[part.type] = part.value
            return acc
        }, {})

        return `${p.year}-${p.month}-${p.day}`
    },
    getYear: date=>{
        return new Intl.DateTimeFormat("en-GB", {
            year: "numeric"
        }).format(date)
    },
    getMonth: date=>{
        return new Intl.DateTimeFormat("en-GB", {
            month: "long"
        }).format(date)
    },
    range: (start, stop, step=1)=>{
        return Array(stop-start).fill(start).map((x,y)=>x+y*step)
    },
    isStockValid: (stock)=>{
        return cts.valid(stock) 
    },
    getStockIssueType: async (ticker)=> {
        const response = await tradeService.getTickerIssueType(ticker)
        return response
    },
    isListEmpty: (list)=>{
        return true ? list.length === 0 : false
    },
    isTitleValid: async (title)=>{
        if(title.length === 0)
            return false

        const result = await tradeService.listAction('CHECK_TITLE', title)
        return result.status
    }
}

export default Helper