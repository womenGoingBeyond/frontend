import styles from '../styles/routes/login.module.css'
import mainStyles from '../styles/main.module.css'
import { Alert, Button, Snackbar } from '@mui/material'
import { useRef, useState } from 'react'
import Auth from '../util/auth'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import IconTextField from '../components/IconTextField'
import CustomButton from '../components/CustomButton'
import LockIcon from '@mui/icons-material/Lock';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import Header from '../components/Header' 
import { saveUserData } from '../util/helper.js'
import { useTranslation } from 'react-i18next';
import { useLoading }  from '../components/LoadingContext'


export default function Login() {
  const [snackbarObject, setSnackbarObject] = useState({})
  const emailRef = useRef()
  const passwordRef = useRef()
  const navigate = useNavigate()
  const {t, i18n} = useTranslation()
  const { loading, setLoading } = useLoading();


  /**
   * @async
   * @param {string} email
   * @param {string} password
   * @returns {Promise<void>}
   */
  async function loginUser({ email, password }) {
    setLoading(true);
    const response = await Auth.login({
      identifier: email,
      password: password
    })
    

    setLoading(false);
    if (Object.keys(response).includes('error')) {
      handleSnackbar({ open: true, message: response.error.message, severity: 'error' })
    } else {
      window.sessionStorage.setItem('wgb-jwt', response.jwt)
      // remove login route from the history stack

      saveUserData(response.user)

      let from = navigate.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    }
  }

  function handleSubmit() {
    const email = emailRef.current.value, password = passwordRef.current.value
    const isValid = validateInput({ email: emailRef.current, password: passwordRef.current })
    isValid && loginUser({ email, password }).catch(console.error)
  }

  /**
   * @param {HTMLInputElement} email
   * @param {HTMLInputElement} password
   * @returns {boolean}
   */
  function validateInput({ email, password }) {
    if (email.validity.valueMissing || password.validity.valueMissing) {
      handleSnackbar({ open: true, message: 'Please give an email/password.', severity: 'error' })
      return false
    }
    if (!email.validity.valid) {
      handleSnackbar({ open: true, message: 'email is not valid', severity: 'error' })
      return false
    }
    if (password.validity.tooShort) {
      handleSnackbar({ open: true, message: 'too short password', severity: 'error' })
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
       <IconTextField
        fullWidth
        required
        marginTop="30px"
        error={snackbarObject.severity === 'error'}
        id="email"
        placeholder={t('emailPlaceholder')}
        type="email"
        variant="outlined"
        inputRef={emailRef}
          iconStart={<AlternateEmailIcon />}
        />
       
        <IconTextField
        fullWidth
        required
        error={snackbarObject.severity === 'error'}
        id="password"
        placeholder={t('passwordPlaceholder')}
        type="password"
        inputRef={passwordRef}
          iconStart={<LockIcon />}
        />
        
            <p className={styles.register}>
            <Link to={'/resetpass'} className={styles.registerLink}>{t('forgotPasswordLink')}</Link>
        </p>
          <CustomButton
          marginTop="1rem"
            children={t('loginButton')}
            onClick={handleSubmit}
          />


        </div>

        <div className={styles.bottomImage}
            />

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
