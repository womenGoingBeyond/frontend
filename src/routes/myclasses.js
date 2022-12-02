import mainStyles from '../styles/components/CompletedCourse.module.css'
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
  const [loading, setLoading] = useState(false); 


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
          setLoading(true);
          const userEndpoint = await Api.get(`api/users/me` ) 
            Api.get(`api/certificate/${userEndpoint.id}/allCertificates`)
            .then( async response => {
              console.log('response', response);
              if(response.data.length > 0){
                console.log("response.data", response.data);
                setAllCertificates(response.data)
              }
            }).catch(console.error)
            setLoading(false);
        }  

        return (
          <>
    
            <Header  title={t("myClassesHeader")} isSubpage="true"/>
            
            <main>
              <div className={mainStyles.CertHeader}>
                <h1>{t("myClassesCompleted")}</h1>
              </div>
              <ul style={{listStyleType:"none",padding: "0"}}>

              {!loading && allCertificates.length > 0 ? allCertificates.map((oneCertificate, index) => {

                return <li key={index}>
                  <section className={mainStyles.Certificates}>
                    <CompletedCourse certInfo={{
                        certName:oneCertificate.course.category.Name, 
                        certTitle: oneCertificate.course.Title,
                        nameOfStudentPrename:oneCertificate.users_permissions_user.prename,
                        nameOfStudentLastname:oneCertificate.users_permissions_user.lastname,
                        certNumber:oneCertificate.id,
                        certDate:oneCertificate.createdAt
                        }}></CompletedCourse>
                  </section>
              </li>
              }
             
          ) : null}
             {loading && <p>Loading..</p>}          
              </ul>
          </main>
          
        </>
        )

}
