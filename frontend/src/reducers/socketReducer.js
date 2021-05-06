const initialState = {
    ticker: '',
    price: 0
}

const socketReducer = (state=initialState, action)=> {

    switch(action.type){
        case 'DATA_RECEIVED':
            return {
                ticker: action.data.ticker,
                price: action.data.price
            }
        default:
            return state
    }
}

export const updateData = (data)=>{
    return {
        type: 'DATA_RECEIVED',
        data: data 
    }
}

export default socketReducer