const initialState = {
    ticker: '',
    tickerView: 'Overview'
}

const tradeReducer = (state=initialState, action)=>{
    switch(action.type){
        case 'TICKER_VIEW':
            return {
                ...state,
                tickerView: action.data
            }
        case 'TICKER':
            return {
                ...state,
                ticker: action.data
            }
        default:
            return state;
    }
}

export const changeTicker = (t) => {
    return ({
        type: "TICKER",
        data: t 
    })
}

export const changeTickerView = (view) => {
    return ({
        type: "TICKER_VIEW",
        data: view
    })
}

export default tradeReducer;
