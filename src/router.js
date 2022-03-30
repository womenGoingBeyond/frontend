import {Route, Routes} from 'react-router-dom'
import App from './App'
import Login from './routes/login'
import Courses from './routes/courses'
import Register from "./routes/register";

export default function router() {
  return (
    <Routes>
      <Route
        path="/"
        element={<App/>}
      />
      <Route
        path="register"
        element={<Register/>}
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
