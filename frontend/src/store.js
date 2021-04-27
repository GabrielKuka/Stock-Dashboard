import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import userReducer from './reducers/userReducer'
import alertReducer from './reducers/alertReducer'
import tradeReducer from './reducers/tradeReducer'
import socketReducer from './reducers/socketReducer'
import modalReducer from './reducers/modalReducer'


const reducer = combineReducers({
  user: userReducer,
  trade: tradeReducer,
  alert: alertReducer,
  socket: socketReducer,
  modal: modalReducer
})

const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(thunk)  )
)

export default store
