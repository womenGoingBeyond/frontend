import styles from '../styles/components/Header.module.css'
import {Button} from '@mui/material'
import Auth from '../util/auth'
import {useNavigate} from 'react-router'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import MenuIcon from '@mui/icons-material/Menu'; 

export default function Header ({ isSubpage = false, title = "" }) {
  const navigate = useNavigate()

  function logoutUser() {
    let isUserLogout = Auth.logout()
    isUserLogout && navigate('/')
  }

  function routerGoBack() {
    navigate('/')
  }
  



  return (
    <>
      <header 

        className={Auth.getUserIdFromJWT() != null ? styles.header + " " + styles.withBorder : styles.header}
        >
      <div className={styles.headerSub}>
        {Auth.getUserIdFromJWT() == null   && isSubpage   &&  
              <Button
              onClick={routerGoBack}

                sx={{ 
                  color: "#000",
                  backgroundColor: "#f9fafb",
                  ':hover': {
                      bgcolor: '#eeeeee',
                  },
                 }}
              >
                  <ArrowBackIosIcon
                  />
              </Button>   
        }

        {Auth.getUserIdFromJWT() != null   &&  !isSubpage && 
        
        <Button
        // onClick={routerGoBack}

          sx={{ 
            color: "#000",
            backgroundColor: "#f9fafb",
            ':hover': {
                bgcolor: '#eeeeee',
            },
           }}
        >
        <MenuIcon/>
        </Button>   
        }


       <div className={styles.headerTitle} >{title}</div>
       </div>





      <div>
        {Auth.getUserIdFromJWT() != null   &&  
            <Button className={styles.logoutButton} variant="contained" onClick={logoutUser} sx={{marginRight: '1rem'}} disableElevation>
              LOG OUT
            </Button> 
        }
        </div>

 
   
        
        {/* TODO: add a refresh icon to pull content from cms */}
      </header>
    </>
  )
}
