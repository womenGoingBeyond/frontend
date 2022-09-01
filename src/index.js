import React from 'react'
import './styles/index.css'
import Router from './router'
import { createRoot } from 'react-dom/client'
import * as serviceWorker from './serviceWorkerRegistration'
import { BrowserRouter } from 'react-router-dom' 


const container = document.getElementById('root')
const root = createRoot(container) // createRoot(container!) if you use TypeScript



root.render(
  <BrowserRouter>
    <Router/>
  </BrowserRouter>
)

if (process.env.NODE_ENV === 'development') {
  // reportWebVitals(console.log)
}

serviceWorker.register()


