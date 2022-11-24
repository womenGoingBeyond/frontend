import {useEffect} from 'react'
import {useNavigate} from 'react-router'
import mainStyles from '../styles/main.module.css'
import CustomButton from '../components/CustomButton'
import { useTranslation } from 'react-i18next';
import { useState } from 'react'
import ReactFlagsSelect from "react-flags-select";
import { saveUserSelectedLanguage, getUserSelectedLanguage } from '../util/helper.js'

export default function Home() {
  const navigate = useNavigate()
  const {t, i18n} = useTranslation();
  const [selected, setSelected] = useState("");

  useEffect(() => {
    window.sessionStorage.getItem('wgb-jwt') !== null ? navigate('/categories') : navigate('/')
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // set defaul Language 
    var language = getUserSelectedLanguage();
    if(language == null || language == ""){
      setSelectedLanguage("KH");
    }else{
      setSelectedLanguage(language);
    }
  }, [])



  function goToLogin() {
    navigate('/login')
  }
  

  function goToRegister() {
    navigate('/register')
  }
  


  function setSelectedLanguage(code){ 
    setSelected(code);
    saveUserSelectedLanguage(code);
    if(code == "KH" ){
      i18n.changeLanguage("km-KH");
    }else{
      i18n.changeLanguage("en");
    }
  }

 
  return (
    <> 
      <div className={mainStyles.container + " " + mainStyles.frontpage}>
   
  <ReactFlagsSelect
      fullWidth={false}
    selected={selected}
  countries={["US", "KH"]}
  customLabels={{ "US": "English", "KH": "Khmer"}}
 
    onSelect={(code) => setSelectedLanguage(code)}
  />
        <div className={mainStyles.logoStart}/>
      
        <div className={mainStyles.form}>
        
        
   <CustomButton
            children={t('loginButton')}
            marginTop="50px"
            marginRight='10px'
            marginLeft="10px" 
            onClick={goToLogin}
          />

        <CustomButton
            children={t('signupButton')}
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
