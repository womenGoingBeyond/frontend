import styles from '../styles/components/Footer.module.css'
import {Button} from '@mui/material'
import Auth from '../util/auth'
import {useNavigate} from 'react-router'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ExtensionIcon from '@mui/icons-material/Extension';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PersonIcon from '@mui/icons-material/Person';

export default function Footer ({ actualRoute = "" }) {
  const navigate = useNavigate()

  function logoutUser() {
    let isUserLogout = Auth.logout()
    isUserLogout && navigate('/')
  }

  function routerGoBack() {
    navigate('/')
  }
  
  var exploreButton = false;
  var myClassesButton = false;
  var profileButton = false;
  if(actualRoute == ""){
    exploreButton = true;
    console.log(exploreButton)
  }else{

  }



  return (
    <>
      <footer 

        className={styles.footer}
        >
            <div className={styles.innerFooter}>
      <Button
        className={exploreButton ? styles.button + " active " + styles.isActive : styles.button + " active " + styles.isActive}
      
    
              onClick={routerGoBack}
                active
                sx={{ 
                  color: "#cccccc",
                  bgcolor: "#ffffff",
                  ':hover': {
                    color: '#ce6328',
                    bgcolor: "#ffffff",
                  }, 
                  "&:active": {
                    color: '#ce6328',
                    backgroundColor: "purple"
                  }
                 }}
              >
                  <ExtensionIcon  className={styles.activeIcon}
                  sx={{
                    fontSize: "28pt",}}
                  />
                  Explore
              </Button>   
              
              <Button
                className={styles.button}
                onClick={routerGoBack}

                sx={{ 
                  color: "#cccccc",
                  bgcolor: "#ffffff",
                  ':hover': {
                    color: '#ce6328',
                    bgcolor: "#ffffff",
                  },
                  ':active': {
                    color: '#ce6328',
                  },
                 }}
              >
                  <AutoStoriesIcon
                  sx={{
                    fontSize: "28pt",}}
                  />
                  My Classes
              </Button>   
              
              <Button
            className={styles.button}
              onClick={routerGoBack}

                sx={{ 
                  color: "#cccccc",
                  bgcolor: "#ffffff",
                  ':hover': {
                    color: "#ce6328",
                    bgcolor: "#ffffff",
                  },
                  ':active': {
                    color: '#ce6328',
                  },
                 }}
              >
                  <PersonIcon
                  sx={{
                    fontSize: "28pt",}}
                  />
                  Profile
              </Button>   



            </div>

 

 
   
        
        {/* TODO: add a refresh icon to pull content from cms */}
      </footer>
    </>
  )
}
