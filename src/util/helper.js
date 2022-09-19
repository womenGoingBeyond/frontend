
import Data from './data'

var userSelectedLanguage = window.sessionStorage.getItem('language', "");
function saveUserSelectedLanguage(language){
  userSelectedLanguage = language;
  window.sessionStorage.setItem('language', language)
}

function getUserSelectedLanguage(){
    return userSelectedLanguage;
}

function saveUserData(user){
  let commonData = Data.getInstance();
  commonData.setUserID(user.id);
  commonData.setUserEmail(user.email);
  commonData.setUserPrename(user.prename);
  commonData.setUserLastname(user.lastname);
  commonData.setBirthDate(user.birthdayNumber); 
  commonData.setLevelOfEducation(user.levelOfEducation);
  commonData.setUserPoints(user.user_points)
}

export {saveUserData, saveUserSelectedLanguage, getUserSelectedLanguage}
