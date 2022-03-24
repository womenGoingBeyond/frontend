import { useEffect } from 'react'
import { useNavigate } from 'react-router'

export default function Home() {
  let navigate = useNavigate()

  useEffect(() => {
    window.localStorage.clear()

    navigate('/login')
  }, [])

  return (
    <></>
  )
}
