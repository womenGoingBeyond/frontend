import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import Router from './router'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
  <React.StrictMode>
    <Router/>
  </React.StrictMode>,
  document.getElementById('root')
)

reportWebVitals(console.log)
