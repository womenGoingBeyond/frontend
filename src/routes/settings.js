 
import Auth from '../util/auth' 
import { useNavigate } from 'react-router' 
import Header from '../components/Header' 
import mainStyles from '../styles/main.module.css'
import IconTextField from '../components/IconTextField'
import DateTextField from '../components/DateTextField'
import CustomButton from '../components/CustomButton'
import PersonIcon from '@mui/icons-material/Person';
import Data from '../util/data.js' 
import {useEffect} from 'react'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {  useState } from 'react'
import SchoolIcon from '@mui/icons-material/School';
import Api from '../util/api'

import Switch from '@mui/material/Switch'; 
import FormControlLabel from '@mui/material/FormControlLabel';
import { useTranslation } from 'react-i18next'
import ReactFlagsSelect from "react-flags-select";

import { saveUserSelectedLanguage, getUserSelectedLanguage } from '../util/helper.js'

export default function Settings() {

  const {t, i18n} = useTranslation()
  let commonData = Data.getInstance()
  const time = new Date(parseInt(commonData.getBirthDate(),10));
  const [selected, setSelected] = useState("");

    const navigate = useNavigate()
    const [value, setValue] = useState(time) 
    const [prename, setUserPrename] = useState(commonData.getUserPrename()); // '' is the initial state value
    const [lastname, setUserLastname] = useState(commonData.getUserLastname()); // '' is the initial state value
    const [levelOfEducation, setLevelOfEducation] = useState(commonData.getLevelOfEducation()); // '' is the initial state value
    const [dataChanged, setDataChanged] = useState(false)


  useEffect(() => {  
    // set defaul Language 
    var language = getUserSelectedLanguage();
    if(language == ""){
      setSelectedLanguage("KH");
    }else{
      setSelectedLanguage(language);
    }

    loadAllData()
  }, [])




async function loadAllData(){
  const apiEndpoint = await Api.get(`api/users/me` ) 
  console.log(apiEndpoint)
  setUserPrename(apiEndpoint.prename != null ? apiEndpoint.prename : "")
  setUserLastname(apiEndpoint.lastname != null ? apiEndpoint.lastname : "")
  setLevelOfEducation(apiEndpoint.levelOfEducation != null ? apiEndpoint.levelOfEducation : "") 

  const time2 = new Date(parseInt(apiEndpoint.birthdayNumber,10));
  setValue(time2)
}


    function logoutUser() {
      let isUserLogout = Auth.logout()
      isUserLogout && navigate('/')
      commonData.clearAllUserData()
    }


    async function saveChanges(){
      console.log(value)
      setDataChanged(false)

      var body = {
        "birthdayNumber": value.getTime(),
        "prename": prename,
        "lastname": lastname,
        
      };
    const apiEndpoint2 = await Api.put(`api/users/${Auth.getUserIdFromJWT()}`, body ) 
    console.log("AAAA", apiEndpoint2)
    
      
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
    <Header title={t("settingsHeader")} isSubpage="true" showSettingsIcon="false"/>
   
   
    <main>
    <div className={mainStyles.form}  style={{marginTop:"20px"}}>

 

<div style={{color: "#aaa"}}>{t("sectionProfileSettings")}</div>

<IconTextField
        fullWidth
        required
        value={prename} onChange={(e) => {
          setUserPrename(e.target.value)
          setDataChanged(true)
        }}
        // error={(emailErrorArray.includes(snackbarObject.id)) && snackbarObject.severity === 'error'}
        id="prename"
        placeholder={t("prenamePlaceholder")}
        type="text"
        variant="outlined" 
        iconStart={<PersonIcon />}
        // inputRef={userID}
        />

    <IconTextField
            fullWidth
            required
            value={lastname} onChange={(e) => {
              setUserLastname(e.target.value)
              setDataChanged(true)
            }}
            // error={(emailErrorArray.includes(snackbarObject.id)) && snackbarObject.severity === 'error'}
            id="lastname"
            placeholder={t("lastnamePlaceholder")}
            type="text"
            variant="outlined" 
            iconStart={<PersonIcon />}
            // inputRef={userID}
            />

    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={t("birthdayPlaceholder")}
        value={value}
        onChange={(newValue) => {
          setValue(newValue)
          setDataChanged(true)
        }} 
        renderInput={(params) => 
          <DateTextField
          {...params}
          fullWidth
          // error={(emailErrorArray.includes(snackbarObject.id)) && snackbarObject.severity === 'error'}
        
          variant="outlined"
          // inputRef={emailRef}
          />}
      />
    </LocalizationProvider>
              

    
    <IconTextField
            fullWidth
            required
            value={levelOfEducation} onChange={(e) => {
              setLevelOfEducation(e.target.value)
              setDataChanged(true)
            }}
            // error={(emailErrorArray.includes(snackbarObject.id)) && snackbarObject.severity === 'error'}
            id="education"
            placeholder={t("levelOfEducationPlaceholder")}
            type="text"
            variant="outlined"
            iconStart={<SchoolIcon />}
            // inputRef={emailRef}
            />
 

<CustomButton 
        style={{ marginTop:"20px"}}
            children={t("saveChangesButton")}
            onClick={saveChanges}
            className={!dataChanged? mainStyles.hidden : undefined}
          />


<div style={{color: "#aaa", marginTop:"20px"}}>{t("sectionSystemSettings")}</div>

<FormControlLabel
          value="start"
          control={<Switch    />}
          label={t("downloadOptionLabel")}
          labelPlacement="start"
        />



<ReactFlagsSelect
      fullWidth={false}
    selected={selected}
  countries={["US", "KH"]}
  customLabels={{ "US": "English", "KH": "Khmer"}}
 
    onSelect={(code) => setSelectedLanguage(code)}
  />
        <CustomButton 
        style={{ marginTop:"20px"}}
            children={t("logoutButton")}
            onClick={logoutUser}
          />
        </div>
 
        

     </main>
      
      
    </>
  )
}
