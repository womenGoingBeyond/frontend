import mainStyles from '../styles/components/CompletedCourse.module.css'
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import Certificate from '../components/generateCertificate/certificate';
import CustomButton from '../components/CustomButton'


export default function completedCourse(props) {
  
  const handleClick = event => {

    console.log('Image clicked');
  };

  return (
      <>
      <PDFDownloadLink
      document={<Certificate
        category={props.certInfo.certName}
        course={props.certInfo.certTitle}
        nameOfStudent={props.certInfo.nameOfStudentPrename + " " + props.certInfo.nameOfStudentLastname}
        certNumber={String(props.certInfo.certNumber).padStart(6, '0')}
        certDate={props.certInfo.certDate}

      ></Certificate>}>

      
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        <div className={mainStyles.Wrapper}>
          <div className={mainStyles.PictureAndIcon}>
            <img src="https://picsum.photos/200/300?grayscale" onClick={handleClick}/>
            <div className={mainStyles.Icon}>
              <i className="fa fa-download"></i>
            </div>

            <div className={mainStyles.Text}>
              <h2>{props.certInfo.certName}</h2>
            </div>
          </div>
        </div>
      
      </PDFDownloadLink>
      
      </>
    )
  }