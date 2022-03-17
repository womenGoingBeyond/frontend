import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './routes/Login';

export default function router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <App/> }/>
        <Route path="register" element={ <Login/> }/>
      </Routes>
    </BrowserRouter>
  );
}
