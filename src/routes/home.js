import {useEffect} from 'react'
import {useNavigate} from 'react-router'

export default function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    window.sessionStorage.getItem('wgb-jwt') !== null ? navigate('/courses') : navigate('/login')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <></>
  )
}
