import {Navigate, useLocation} from 'react-router'
import Auth from '../util/auth'

export default function AuthMiddleware(props) {
  const location = useLocation()
  const token = window.sessionStorage.getItem('wgb-jwt')

  // Redirect them to the /login page, but save the current location they were
  // trying to go to when they were redirected. This allows us to send them
  // along to that page after they login, which is a nicer user experience
  // than dropping them off on the home page.
  if (token === null) {
    return <Navigate to="/login" state={{from: location}} replace={true}/>
  }

  if (!Auth.validateExpFromJWT()) {
    return <Navigate to="/login" state={{from: location}} replace={true}/>
  }

  return props.children
}
