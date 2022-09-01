import './styles/App.css'
import Home from './routes/home'
import './i18n';
import { useState } from 'react'
import React, {Suspense} from 'react';
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const [isLoading, setIsLoading] = useState(false); 
  return (
    <>
    <Suspense fallback="loading">
      <Home />
      {isLoading ? <LoadingSpinner /> : null}
      </Suspense> 
    </>
  )
}

export default App
