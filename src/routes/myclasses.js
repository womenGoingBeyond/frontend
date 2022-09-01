import mainStyles from '../styles/main.module.css'
import Header from '../components/Header'
import { useTranslation } from 'react-i18next'
import Certificate from '../components/generateCertificate/certificate';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';


export default function MyClasses() {
  const {t, i18n} = useTranslation()

  const fileName = "Certificat-Name.pdf";

  return (
    <>
    <Header title={t("myClassesHeader")} isSubpage="true"/>

    <main>
      <div className={mainStyles.container}>
      
      <PDFViewer width={"400px"} height={"600px"} showToolbar={false}>
        <Certificate category="Kategsdfsfsdfsdfsdsad" course="fsfwefefwefwefwef wefwefwe fwefwewefef" nameOfStudent="name" certNumber="Asdsjd" certDate="234234234" />
      </PDFViewer>

      <div className='download-link'>
        <PDFDownloadLink
          document={<Certificate  category="Kategsdfsfsdfsdfsdsad" course="fsfwefefwefwefwef wefwefwe fwefwewefef" nameOfStudent="name" certNumber="Asdsjd" certDate="234234234" />}
          fileName={fileName}
        >
          {({ blob, url, loading, error }) =>
            loading ? "Loading..." : "Download Certificate"
          }
        </PDFDownloadLink>
      </div>

      </div>
      </main>
    
    </>
  )
}
