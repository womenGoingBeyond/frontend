import mainStyles from '../styles/components/CompletedCourse.module.css'
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import Certificate from '../components/generateCertificate/certificate';
import DownloadDoneIcon from '@mui/icons-material/Download'


export default function completedCourse(props) {
  
  const handleClick = event => {

    console.log('Image clicked');
  };

  return (
      <>
      <PDFDownloadLink className={mainStyles.PDFWrapper}
      document={
      <Certificate
        category={props.certInfo.certName}
        course={props.certInfo.certTitle}
        nameOfStudent={props.certInfo.nameOfStudentPrename + " " + props.certInfo.nameOfStudentLastname}
        certNumber={String(props.certInfo.certNumber).padStart(6, '0')}
        certDate={props.certInfo.certDate}
      ></Certificate>}>

        <div className={mainStyles.WrapperText}>
          <i className="fa fa-download"></i>
          <p>{props.certInfo.certName}</p>
          <h3>{props.certInfo.certTitle}</h3>
        </div>
        
        <div className={mainStyles.DownloadIcon}>
          <DownloadDoneIcon/>
        </div>
      </PDFDownloadLink>
      </>
    )
  }