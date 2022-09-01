import React from 'react';
import { NavLink } from 'react-router-dom';
import ExtensionIcon from '@mui/icons-material/Extension';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PersonIcon from '@mui/icons-material/Person';
import styles from './styles/components/Navigation.module.css'
import { useTranslation } from 'react-i18next'

import { useLocation } from "react-router-dom";



const Navigation = (props) => {


  const {t, i18n} = useTranslation() 
  const location = useLocation(); 
  const { pathname } = location; 
  const splitLocation = pathname.split("/");


	return (

      <footer 

      className={styles.footer}
      >
        <div className={styles.innerFooter}>
     
         
                 <NavLink to="/categories"  
                  activeclassname="active"
               className={
               (splitLocation[1] != "myclasses" && splitLocation[1] != "profile" && splitLocation[1] != "settings"  ? styles.navLink + " " + styles.active : styles.navLink)}>
                   <ExtensionIcon  
                
                  sx={{
                    fontSize: "28pt",}}
                  />
                     <div className={styles.active}>{t("exploreTabLabel")}</div> 
                 </NavLink>
               
            
                 <NavLink to="/myclasses"  activeclassname="active"
                  className={(splitLocation[1] === "myclasses"  ? styles.navLink + " " + styles.active : styles.navLink)}>
                   <AutoStoriesIcon  
                  sx={{
                    fontSize: "28pt",}}
                  />
                     <div>{t("myClassesTabLabel")}</div> 
                 </NavLink> 

 
                 <NavLink to="/profile"  activeclassname="active" className={(splitLocation[1] === "profile" || splitLocation[1] === "settings"  ? styles.navLink + " " + styles.active : styles.navLink)}>
                    <PersonIcon  
                  sx={{
                    fontSize: "28pt",}}
                  />
                     <div>{t("profileTabLabel")}</div> 
                 </NavLink> 
   
    </div>
    </footer>
  )
};

export default Navigation;