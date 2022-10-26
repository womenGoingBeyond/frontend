import mainStyles from '../styles/main.module.css'
import { useEffect, useState } from 'react'
import Header from '../components/Header'
import ProgressProvider from "../components/ProgressProvider";
import "react-circular-progressbar/dist/styles.css";
import logo from '../img/Blitz_color.svg';
import Data from '../util/data.js' 
import { useTranslation } from 'react-i18next'
import Api from '../util/api'

import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar";

export default function Profile() {



  const {t, i18n} = useTranslation()
  let commonData = Data.getInstance()
  let userPoints = commonData.getUserPoints()



  useEffect(() => {
    loadAllData()
  }, [])



async function loadAllData(){
  const apiEndpoint = await Api.get(`api/users/me` )
  userPoints = apiEndpoint.user_points
}
  


  let level = userPoints % 25
  let levelNumber = Math.floor(userPoints/25) +1
  let percentage = (level * 100) / 25

  return (
    <>
    <Header title={t("myProfileHeader")} isSubpage="true" showSettingsIcon="true"/>
  
    <main>
      <div style={{ marginTop:"20px", width: 230, height: 230 }}>
      <ProgressProvider valueStart={0} valueEnd={percentage}>
 
        {value => (
          <CircularProgressbar
            value={value}
            text={`Level ${levelNumber}`}
            circleRatio={0.75}
            styles={buildStyles({
              pathColor: `#ACCB53`,
              textColor: '#ACCB53',
              rotation: 1 / 2 + 1 / 8,
              strokeLinecap: "round",
              pathTransitionDuration: 2,
              trailColor: "#eee",
            })}
          />
        )}
      </ProgressProvider>
      </div>
      <table className={mainStyles.profileTable}>
        <tr>
          <th className={mainStyles.profileTableTD}>{userPoints} <img style={{  width: "28px", height: "33px" }} src={logo} alt="Logo" /></th>
          <th>4</th>
        </tr>
        <tr>
          <td>{t("infoTotalEnergy")}</td>
          <td>{t("infoCertificates")}</td>
        </tr>
      </table>
      </main>
    
    </>
  )
}
