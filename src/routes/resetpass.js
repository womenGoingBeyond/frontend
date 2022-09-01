import mainStyles from '../styles/main.module.css'
import { Alert, Button, Snackbar } from '@mui/material'
import { useRef, useState } from 'react' 
import IconTextField from '../components/IconTextField'
import CustomButton from '../components/CustomButton'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import Header from '../components/Header'
import { useTranslation } from 'react-i18next';

export default function ResetPass() {
  const [snackbarObject, setSnackbarObject] = useState({})
  const emailRef = useRef()
  const {t, i18n} = useTranslation()

 

  function handleSubmit() {
    const email = emailRef.current.value
    const isValid = validateInput({ email: emailRef.current})
    // isValid && loginUser({ email, password }).catch(console.error)
  }

  /**
   * @param {HTMLInputElement} email
   * @param {HTMLInputElement} password
   * @returns {boolean}
   */
  function validateInput({ email }) {
    if (email.validity.valueMissing) {
      handleSnackbar({ open: true, message: 'Please give an email/password.', severity: 'error' })
      return false
    }
    if (!email.validity.valid) {
      handleSnackbar({ open: true, message: 'email is not valid', severity: 'error' })
      return false
    } 

    handleSnackbar({ open: snackbarObject.open, message: '', severity: 'success' })
    return true
  }

  function handleCloseSnackbar() {
    handleSnackbar({
      open: false, message: '', severity: snackbarObject.severity
    })
  }

  /**
   * The **handleSnackbar** function is a template for setting the _snackbarObject_ state.
   *
   * @param {boolean} open triggers the open or the close state of snackbar
   * @param {string} message the message to be shown in UI
   * @param {string} severity kind of message
   */
  function handleSnackbar({ open, message, severity }) {
    setSnackbarObject({ open, message, severity })
  }

  return (
    <>
    <Header isSubpage="true"/>
      <div className={mainStyles.container}>
        <div className={mainStyles.logo}/>
      
        <div className={mainStyles.form}>
        
        <p style={{marginLeft:"20px"}}>
        {t('resetEmailInfo')}</p>
       <IconTextField
        fullWidth
        required
        marginTop="0px"
        error={snackbarObject.severity === 'error'}
        id="email"
        placeholder={t('emailPlaceholder')}
        type="email"
        variant="outlined"
        inputRef={emailRef}
          iconStart={<AlternateEmailIcon />}
        />
       
    
          <CustomButton
          marginTop="1rem"
            children={t('resetPasswordButton')} 
            onClick={handleSubmit}
          />


        </div>


      </div>
      <Snackbar
        open={snackbarObject.open}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          variant="filled"
          severity={snackbarObject.severity}
          sx={{ width: '100%' }}
          children={snackbarObject.message}
        />
      </Snackbar>
    </>
  )
}
