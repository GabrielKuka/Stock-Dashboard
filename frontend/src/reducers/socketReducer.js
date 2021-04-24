const initialState = {
    tickers: {
        ticker: '',
        price: 0
    } 
}

const socketReducer = (state=initialState, action)=> {

    switch(action.type){
        case 'DATA_UPDATED':
            return {
                tickers: action.data
            }
        default:
            return state
    }
}

export const updateData = (tickers)=>{
    return {
        type: 'DATA_UPDATED',
        data: tickers
    }
}

export default socketReducer