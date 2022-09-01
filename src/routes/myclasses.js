import mainStyles from '../styles/main.module.css'
import Header from '../components/Header'
import { useTranslation } from 'react-i18next'
import Certificate from '../components/generateCertificate/certificate';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import Data from '../util/data.js' 


export default function MyClasses() {
  const {t, i18n} = useTranslation()
  let commonData = Data.getInstance()

  const fileName = "Certificat-Name.pdf";

  return (
    <>
    <Header title={t("myClassesHeader")} isSubpage="true"/>

    <main>
      <div className={mainStyles.container}>
      
      {/* <PDFViewer width={"400px"} height={"600px"} showToolbar={false}>
        <Certificate category="Kategsdfsfsdfsdfsdsad" course="fsfwefefwefwefwef wefwefwe fwefwewefef" nameOfStudent="name" certNumber="Asdsjd" certDate="234234234" />
      </PDFViewer> */}

      <div className='download-link'>
        <PDFDownloadLink
        // nameOfStudent={commonData.getUserPrename() + " " + commonData.getUserLastname()}
          document={<Certificate  category="Example Category" course="This is an Example Course" nameOfStudent="Max Mustermann" certNumber="100" certDate="07/22/2022" />}
          fileName={fileName}
        >
          {({ blob, url, loading, error }) =>
            loading ? "Loading..." : "Download example certificate"
          }
        </PDFDownloadLink>
      </div>

      </div>
      </main>
    
    </>
  )
}
