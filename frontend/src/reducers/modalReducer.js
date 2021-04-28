const initialState = {
    modalType: null,
    data: {
        text: '',
        show: false
    }
}

const modalReducer = (state=initialState, action)=>{
    switch(action.type){
        case 'ERROR':
            return {
                modalType: 'Error',
                data: action.data
            }
        case 'PROMPT':
            return {
                modalType: 'Prompt',
                data: action.data
            }
        default: return state
    }
}

export const promptModal = (text, status=true, confirm=false)=>{
    return ({
        type: 'PROMPT',
        data: {
            text: text,
            show: status,
            confirm: confirm 
        }
    })
}

export const errorModal = (text, status=true)=>{
    return ({
        type: 'ERROR',
        data: {
            text: text,
            show: status
        }
    })
}

export default modalReducer