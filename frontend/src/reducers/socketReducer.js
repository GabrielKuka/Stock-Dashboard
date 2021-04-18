const initialState = {
    logInState: false,
    listenState: 'unlisten',
    tickers: []
}

const socketReducer = (state=initialState, action)=> {

    switch(action.type){
        case 'SOCKET_LOGIN':
            return {
                ...state,
                logInState: action.data
            }

        case 'SOCKET_LISTEN':
            return {
                ...state,
                listenState: action.data
            }
        case 'SET_TICKERS':
            return {
                ...state,
                tickers: action.data
            }
        default:
            return state
    }
}

export const changeLogin = (status)=>{
    return {
        type: 'SOCKET_LOGIN',
        data: status
    }
}

export const changeListen = (status)=>{
    return {
        type: 'SOCKET_LISTEN',
        data: status
    }
}

export const setTickers = (tickers)=>{
    return {
        type: 'SET_TICKERS',
        data: tickers
    }
}

export default socketReducer