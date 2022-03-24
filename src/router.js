import { Route, Routes } from 'react-router-dom'
import App from './App'
import Login from './routes/Login'
import Courses from './routes/Courses'

export default function router() {
  return (
    <Routes>
      <Route
        path="/"
        element={<App/>}
      />
      <Route
        path="login"
        element={<Login/>}
      />
      <Route
        path="courses"
        element={<Courses/>}
      />
    </Routes>
  )
}
