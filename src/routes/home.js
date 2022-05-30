import {useEffect} from 'react'
import {useNavigate} from 'react-router'
import mainStyles from '../styles/main.module.css'
import CustomButton from '../components/CustomButton'

export default function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    window.sessionStorage.getItem('wgb-jwt') !== null ? navigate('/courses') : navigate('/')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  function goToLogin() {
    navigate('/login')
  }
  

  function goToRegister() {
    navigate('/register')
  }
  


 
  return (
    <>
    
      <div className={mainStyles.container + " " + mainStyles.frontpage}>
        <div className={mainStyles.logoStart}/>
      
        <div className={mainStyles.form}>
        
        
        <CustomButton
            children={'Login'}
            marginTop="50px"
            marginRight='10px'
            marginLeft="10px" 
            onClick={goToLogin}
          />

        <CustomButton
            children={'Signup'}
            marginRight='10px'
            marginBottom="0px"
            marginLeft="10px" 
            customBGColor="#fff"
            customBGHoverColor="#f6f6f6"
            customColor="#000" 
            onClick={goToRegister}
          />


        </div>

         

      </div>
    </>
  )
}
