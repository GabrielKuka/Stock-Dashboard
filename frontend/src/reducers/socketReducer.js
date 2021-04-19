const initialState = {
    tickers: {
        ticker: '',
        price: 0
    } 
}

const socketReducer = (state=initialState, action)=> {

    switch(action.type){
        case 'UPDATE_DATA':
            return {
                tickers: action.data
            }
        default:
            return state
    }
}

export const updateData = (tickers)=>{
    return {
        type: 'UPDATE_DATA',
        data: tickers
    }
}

export default socketReducer