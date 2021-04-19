import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import {
  BrowserRouter as Router,
} from "react-router-dom" 
import store from './store'


import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

const renderApp = () => {
  ReactDOM.render(

  <Provider store={store} className='body'>
      <Router>
          <App />   
      </Router>
  </Provider>
  ,
  document.getElementById('root'))
}
renderApp()
