import styles from '../styles/routes/login.module.css'
import mainStyles from '../styles/main.module.css'
import { Alert, Button, Snackbar } from '@mui/material'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router' 
import CustomButton from '../components/CustomButton' 
import { useTranslation } from 'react-i18next'

export default function Welcome() {

 
  const navigate = useNavigate()
  const {t, i18n} = useTranslation()

  function handleSubmit() {
    navigate(`/categories/`)
  }




  return (
    <>
    {/* <Header isSubpage="true" hideBorderBottom="true"/> */}
      <div className={mainStyles.container}>
        <div className={mainStyles.logo}/>
      
        <p style={{marginLeft:"20px", textAlign: "center"}}> 
        {t("welcomeMessage")}</p>
      
       
        <div className={mainStyles.welcomeGirl}/>
        <div className={mainStyles.welcomeMessage}/>
        <div className={mainStyles.form}>
        
    
          <CustomButton
          marginTop="1rem"
            children={t("nextButton")}
            onClick={handleSubmit}
          />


        </div>


      </div>
   
    </>
  )
}
