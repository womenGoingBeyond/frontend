import styles from '../styles/components/Header.module.css'
import {Button} from '@mui/material'
import Auth from '../util/auth'
import {useNavigate} from 'react-router'

export default function Header() {
  const navigate = useNavigate()

  function logoutUser() {
    let isUserLogout = Auth.logout()
    isUserLogout && navigate('/login')
  }

  return (
    <>
      <header className={styles.header}>
        <Button variant="contained" onClick={logoutUser} sx={{marginRight: '1rem'}} disableElevation>
          LOG OUT
        </Button>
      </header>
    </>
  )
}
