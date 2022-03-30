import {useEffect} from 'react'
import {useNavigate} from "react-router";

export default function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    window.localStorage.getItem('wgb-jwt') !== null ? navigate('/courses') : navigate('/login')
  }, [])

  return (
    <></>
  )
}
