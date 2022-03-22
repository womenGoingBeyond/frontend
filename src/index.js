import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import Router from './router'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Router/>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)

reportWebVitals(console.log)
