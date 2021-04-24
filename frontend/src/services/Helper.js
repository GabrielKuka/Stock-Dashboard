import cts from 'check-ticker-symbol'

const Helper = {
    formatChangePercent: (change) => {
        return Number(100*change).toFixed(2)
    }, 
    formatPrice: (price)=>{
        return Number(price).toFixed(2)
    },
    isStockValid: (stock)=>{
        return cts.valid(stock) 
    }
}

export default Helper