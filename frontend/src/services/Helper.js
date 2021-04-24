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
    isStockValid: (stock)=>{
        return cts.valid(stock) 
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