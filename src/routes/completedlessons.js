import mainStyles from '../styles/main.module.css'
import { useNavigate } from 'react-router'
import CustomButton from '../components/CustomButton'

import Header from '../components/Header'
import ProgressProvider from "../components/ProgressProvider";
import "react-circular-progressbar/dist/styles.css";
import { useTranslation } from 'react-i18next';
import {useLocation} from 'react-router-dom';

import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar";

var percentage = 30
export default function CompletedLessons() {
    const navigate = useNavigate()
    const {t, i18n} = useTranslation()
    
    function goBack(){
        navigate(-1)
    }

    const location = useLocation();
    console.log("AAA", location.state)

  return (
    <>
    <Header title={t('completedLessonsHeader')}  isSubpage="true" showSettingsIcon="true"/>
  
    <main>
      <div style={{ marginTop:"20px", width: 230, height: 230 }}>
      <ProgressProvider valueStart={0} valueEnd={percentage}>
 
        {value => (
          <CircularProgressbar
            value={value}
            text="03/10"
            circleRatio={0.75}
            styles={buildStyles({
              pathColor: `#76D2FA`,
              textColor: '#000',
              rotation: 1 / 2 + 1 / 8,
              strokeLinecap: "round",
              pathTransitionDuration: 2,
              trailColor: "#eee",
            })}
          />
        )}
      </ProgressProvider>
      </div>


      <div className={mainStyles.welcomeMessage} style={{marginTop: "20px", marginBottom:"20px"}}/>
      
      <div className={mainStyles.form}>
        
    
        <CustomButton
        marginTop="1rem"
        children={t('backButton')} 
          onClick={goBack}
        />


      </div>

      </main>
    
    </>
  )
}
