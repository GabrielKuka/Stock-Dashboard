const alertReducer = (state={error:true, text:''}, action) => {
    switch (action.type){

        case 'ERROR_ALERT':
            return {error:true, text: action.data}

        case 'SUCCESS_ALERT':
            return {error:false, text: action.data}
            
        default:
            return state
    }
}

export const errorAlert = (text) => {
    
    return ({
        type: 'ERROR_ALERT',
        data: text
    })
}


export const successAlert = (text) => {
    
    return ({
        type: 'SUCCESS_ALERT',
        data: text
    })
}

export default alertReducer;
