import mainStyles from '../styles/main.module.css'
import { useNavigate } from 'react-router'
import CustomButton from '../components/CustomButton'

import Header from '../components/Header'
import ProgressProvider from "../components/ProgressProvider";
import "react-circular-progressbar/dist/styles.css";
import { useTranslation } from 'react-i18next';
import ReactCanvasConfetti from "react-canvas-confetti";
import { useEffect, useRef, useCallback, useState } from 'react'
import {useLocation} from 'react-router-dom';
import Api from '../util/api'

import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar";




var percentage = 30
export default function CompletedLesson() {
  const [countingNumber, setcountingNumber] = useState(0)
  const [showProgress, setShowProgress] = useState(true)
  const [showBackButton, setShowBackButton] = useState(false)
  const [showFinishedCourse, setShowFinishedCourse] = useState(false)
  const location = useLocation();
 

// TODO GET FINISHED LESSONS / MAXLESSONS


  // console.log('location.state', location.state)
  console.log('location.finishedCourse', location.state.finishedCourse)
  // console.log('params', location.state.params)
 



function animateValue(id, start, end, duration) {
  if (start === end) return;
  var range = end - start;
  var current = start;
  var increment = end > start? 1 : -1;
  var stepTime = Math.abs(Math.floor(duration / range));
  var timer = setInterval(function() {
      current += increment;
      setcountingNumber(current);
      if (current == end) {
          clearInterval(timer);
          showLessonFinished();
      }
  }, stepTime);
}

function showLessonFinished () {
  fire();
  setShowProgress(false);

  console.log('FFFFF', location.state.finishedCourse);
  if(location.state.finishedCourse){
    setTimeout(function() {
      fire();
      setShowFinishedCourse(true);
      setShowBackButton(true)
    }, 4000);
  }else{
    setShowBackButton(true)
  }
}


useEffect(() => {
  animateValue("value", 0, 25, 4000);
}, [])


const canvasStyles = {
  position: "fixed",
  pointerEvents: "none",
  width: "100%",
  height: "100%",
  top: -200,
  left: 0
};

const refAnimationInstance = useRef(null);

const getInstance = useCallback((instance) => {
  refAnimationInstance.current = instance;
}, []);

const makeShot = useCallback((particleRatio, opts) => {
  refAnimationInstance.current &&
    refAnimationInstance.current({
      ...opts,
      origin: { y: 0.7 },
      particleCount: Math.floor(200 * particleRatio)
    });
}, []);



  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55
    });

    makeShot(0.2, {
      spread: 60
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45
    });
  }, [makeShot]);


    const navigate = useNavigate()
    const {t, i18n} = useTranslation()
    
    function goBack(){
                  navigate(`/courses/${location.state.params.courseId}`)
    }

    function showCertificates(){
              navigate(`/myclasses/`)
  }


  return (
    <>
    <Header goBackPath={"/courses/" + location.state.params.courseId} title={t('completedLessonHeader')} isSubpage="true" showSettingsIcon="true"/>
  
    <main>
    <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
      <div className={!showProgress && !showFinishedCourse? mainStyles.addition + " " + mainStyles.fadeIn : mainStyles.addition + " " + mainStyles.fadeOut}>
                +1<div className={(mainStyles.lightning)}/>
        </div>

      <div className={!showProgress && showFinishedCourse? mainStyles.addition + " " + mainStyles.fadeIn : mainStyles.addition + " " + mainStyles.fadeOut}>
                +10<div className={(mainStyles.lightning)}/>
        </div>
      <div className={showProgress? mainStyles.fadeIn : mainStyles.fadeOut} style={{ marginTop:"20px", width: 230, height: 230 }}>
      <ProgressProvider valueStart={0} valueEnd={percentage}>
 
        {value => (
          <CircularProgressbar
            value={value}
            text={countingNumber + "/10"}
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


      <div className={mainStyles.messageIMG} style={{marginTop: "20px", marginBottom:"20px"}}>

      <div style={{alignVertical: "middele"}}> 
        {(showFinishedCourse ? t("messageGratulationCourse") : t("messageGratulation"))}</div>
        </div>
      
      <div className={mainStyles.form}>
        
    
      <CustomButton
      className={showFinishedCourse?  mainStyles.fadeIn : mainStyles.fadeOut}
        marginTop="1rem"
          children={t('getZertificates')} 
          onClick={showCertificates}
        />

        <CustomButton
      className={(showBackButton ?  mainStyles.fadeIn : mainStyles.fadeOut)}
        marginTop="1rem"
          children={t('backButton')} 
          onClick={goBack}
        />


      </div>

      </main>
    
    </>
  )
}
