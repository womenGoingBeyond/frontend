import React from 'react'
import './styles/index.css'
import Router from './router'
import { HashRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import * as serviceWorker from './serviceWorkerRegistration'

const container = document.getElementById('root')
const root = createRoot(container) // createRoot(container!) if you use TypeScript

root.render(
  <HashRouter>
    <Router/>
  </HashRouter>
)

if (process.env.NODE_ENV === 'development') {
  // reportWebVitals(console.log)
}

serviceWorker.register()
