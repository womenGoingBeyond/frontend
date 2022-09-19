import styles from '../styles/components/Header.module.css'
import {Button} from '@mui/material'
import Auth from '../util/auth'
import {useNavigate} from 'react-router'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SettingsIcon from '@mui/icons-material/Settings';

export default function Header ({ isSubpage = false, title = "" , showSettingsIcon = false, hideBorderBottom = false, goBackPath = -1, goBackState=0}) {
  const navigate = useNavigate()

  function logoutUser() {
    let isUserLogout = Auth.logout()
    isUserLogout && navigate('/')
  }

  function routerGoBack() {
    console.log(goBackPath)
    console.log(goBackState)
    if(goBackState!=0){
      navigate(goBackPath, {
        state: goBackState,
      })
    }else{
      navigate(goBackPath)
    }
    
  }
  
  function goToSettings() {
    navigate("/settings")
  }
  



  return (
    <>
      <header 

        className={(Auth.getUserIdFromJWT() != null && !hideBorderBottom ) ? styles.header + " " + styles.withBorder : styles.header}
        >
      <div className={styles.headerSub}>
        {isSubpage   &&  
              <Button
              style={{
                maxWidth: "50px",
                maxHeight: "50px",
                minWidth: "30px",
                minHeight: "30px",
                marginLeft: "20px",
                marginRight: "-20px",
              }}
              onClick={routerGoBack}

                sx={{ 
                  color: "#666",  
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

        

       <div className={styles.headerTitle} >{title}</div>
       </div>

 

       <div>
        {showSettingsIcon &&  
        <Button
        onClick={goToSettings}

          sx={{ 
            color: "#666",
            backgroundColor: "#f9fafb",
            ':hover': {
                bgcolor: '#eeeeee',
            },
           }}
        >
        <SettingsIcon />
        </Button>   
        }
        </div>

 
   
        
        {/* TODO: add a refresh icon to pull content from cms */}
      </header>
    </>
  )
}
