import mainStyles from '../styles/main.module.css'
import Header from '../components/Header'
import { useTranslation } from 'react-i18next'
import Certificate from '../components/generateCertificate/certificate';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import Data from '../util/data.js'
import Api from '../util/api' 
import {useEffect} from 'react'
import {  useState } from 'react'
import CustomButton from '../components/CustomButton'
import CompletedCourse from '../components/completedCourse'


export default function MyClasses() {
  const {t, i18n} = useTranslation()
  let commonData = Data.getInstance()
  const [allCertificates, setAllCertificates] = useState([])  


  // const fileName = "Certificat-Name.pdf";
        // LIST ALL CERTIFICATES
        // KLICK ON CERTIFICATE GENERATES THE PDF
        // DATA FROM CERTIFICATE: ID, COURSEID, USERID, CREATEDAT
        // USER DATA from USERID: NAME 
        // COURSE DATA from COURSEID


        useEffect(() => {   
          loadAllData()
        }, [])
      
        async function loadAllData(){
          const userEndpoint = await Api.get(`api/users/me` ) 
            Api.get(`api/certificate/${userEndpoint.id}/allCertificates`)
            .then( async response => {
              console.log('response', response);
              if(response.data.length > 0){
                console.log("response.data", response.data);
                setAllCertificates(response.data)
              }
            }).catch(console.error)
        }  


  return (
    <>
    <Header title={t("myClassesHeader")} isSubpage="true"/>

    <main>
    <div className={mainStyles.container}>


{allCertificates.length > 0 ? allCertificates.map((oneCertificate, index) =>
  <div
    // className={styles.lesson}
    // onClick={() => lessonClickHandler(lesson.id)}
  >
     
       <PDFDownloadLink
          document={<Certificate  category={oneCertificate.course.category.Name} course={oneCertificate.course.Title} nameOfStudent={oneCertificate.users_permissions_user.prename + " " + oneCertificate.users_permissions_user.lastname} certNumber={String(oneCertificate.id).padStart(6, '0')} certDate={oneCertificate.createdAt} />}
          fileName={"AAA"}
        >
          {({ blob, url, loading, error }) =>
            loading ? "Loading..." : 
                            
                  <CustomButton 
                      children={
                        <>
                          <div>
                            {t("Course") + ": " + oneCertificate.course.category.Name + " -> " + oneCertificate.course.Title}
                          </div>
                        </>
                      }
                    />
          }
        </PDFDownloadLink>
  </div>
) : null}
<CompletedCourse></CompletedCourse>
</div>
    </main>
    
    </>
  )
}
