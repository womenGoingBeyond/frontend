import styles from '../styles/routes/register.module.css'
import mainStyles from '../styles/main.module.css'
import {Alert, Button, Snackbar, TextField} from '@mui/material'
import {useRef, useState} from 'react'
import Auth from '../util/auth'
import {useNavigate} from 'react-router'
import LockIcon from '@mui/icons-material/Lock';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import Header from '../components/Header'
import IconTextField from '../components/IconTextField'
import CustomButton from '../components/CustomButton'
import { saveUserData } from '../util/helper.js'
import { useTranslation } from 'react-i18next';
import { useLoading }  from '../components/LoadingContext'

export default function Register() {
  const [snackbarObject, setSnackbarObject] = useState({})
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmationRef = useRef()
  const navigate = useNavigate()
  const passwordMinLength = 6 // The default length for password in Strapi
  const emailErrorArray = ['input', 'email']
  const passErrorArray = ['input', 'pass', 'eq']
  const {t, i18n} = useTranslation()
  const { loading, setLoading } = useLoading();

  /**
   * The **registerUser** function registers the user based on the email and password given in UI.<br>
   * This function does not validate the user credentials. The credentials have to be validated before invoking this
   * function.
   *
   * @async
   * @returns {Promise<void>}
   */
  async function registerUser() {
    setLoading(true);
    // The response and the including JWT are ignored. @see requirements
    const response = await Auth.register({
      email: emailRef.current.value.trim(),
      password: passwordRef.current.value
    })

    setLoading(false);
    if (Object.keys(response).includes('error')) {
      handleSnackbar({open: true, id: 'input', message: response.error.message, severity: 'error'})
    } else {
      loginUser({ email: emailRef.current.value.trim(), password: passwordRef.current.value }).catch(console.error)
    }
  }


  /**
   * @async
   * @param {string} email
   * @param {string} password
   * @returns {Promise<void>}
   */
   async function loginUser({ email, password }) {
    const response = await Auth.login({
      identifier: email,
      password: password
    })

    if (Object.keys(response).includes('error')) {
      handleSnackbar({ open: true, message: response.error.message, severity: 'error' })
    } else {
      window.sessionStorage.setItem('wgb-jwt', response.jwt)

      saveUserData(response.user)
      // remove login route from the history stack 
      navigate("/welcome", { replace: true })
    }
  }

  function handleSubmit() {
    const isValid = validateInput({
      email: emailRef.current,
      password: passwordRef.current,
      passwordConfirmation: passwordConfirmationRef.current
    })
    isValid && registerUser().catch(console.error)
  }

  /**
   * The **validateInput** function validate the user input provided by UI.<br>
   *
   * @param {HTMLInputElement} email
   * @param {HTMLInputElement} password
   * @param {HTMLInputElement} passwordConfirmation
   * @returns {boolean}
   */
  function validateInput({email, password, passwordConfirmation}) {
    if (email.validity.valueMissing || password.validity.valueMissing || passwordConfirmation.validity.valueMissing) {
      handleSnackbar({
        open: true, id: 'input', message: 'Please give an email/password.', severity: 'error'
      })
      return false
    }
    if (!email.validity.valid) {
      handleSnackbar({open: true, id: 'email', message: 'Email is not valid', severity: 'error'})
      return false
    }
    if (password.validity.tooShort) {
      handleSnackbar({open: true, id: 'pass', message: 'Too short password', severity: 'error'})
      return false
    }
    if (password.value !== passwordConfirmation.value) {
      handleSnackbar({
        open: true, id: 'eq', message: 'Password does not match the password confirmation', severity: 'error'
      })
      return false
    }

    handleSnackbar({open: snackbarObject.open, id: '', message: '', severity: 'success'})
    return true
  }

  function handleCloseSnackbar() {
    handleSnackbar({
      open: false, id: '', message: '', severity: snackbarObject.severity
    })
  }

  /**
   * The **handleSnackbar** function is a template for setting the _snackbarObject_ state.
   *
   * @param {boolean} open triggers the open or the close state of snackbar
   * @param {string} id triggers a specific element that the message belongs to
   * @param {string} message the message to be shown in UI
   * @param {string} severity kind of message
   */
  function handleSnackbar({open, id, message, severity}) {
    setSnackbarObject({open, id, message, severity})
  }

  return (
    <>
    <Header isSubpage="true"/>
      <div className={mainStyles.container}>
        <div className={mainStyles.logo}/>
       
        <p className={styles.registerText}>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. 
        </p>
        <div className={mainStyles.form}>
            <IconTextField
            fullWidth
            required
            error={(emailErrorArray.includes(snackbarObject.id)) && snackbarObject.severity === 'error'}
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
            error={(passErrorArray.includes(snackbarObject.id)) && snackbarObject.severity === 'error'}
            id="password"
            placeholder={t('passwordPlaceholder')}
            type="password"
            inputRef={passwordRef}
            iconStart={<LockIcon />}
            inputProps={{minLength: passwordMinLength}}
            />
            
            <IconTextField
            fullWidth
            required
            error={(passErrorArray.includes(snackbarObject.id)) && snackbarObject.severity === 'error'}
            id="password-confirmation"
            placeholder={t('repeatPasswordPlaceholder')}
            type="password"
            inputRef={passwordConfirmationRef}
            iconStart={<LockIcon />}
            inputProps={{minLength: passwordMinLength}}
            />
              

        <CustomButton 
            children={t('signupButton')}
            onClick={handleSubmit}
          />
        </div>

        <div className={styles.bottomImage}
            />

      </div>
      <Snackbar
        open={snackbarObject.open}
        autoHideDuration={5000}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          variant="filled"
          severity={snackbarObject.severity}
          sx={{width: '100%'}}
          children={snackbarObject.message}
        />
      </Snackbar>
    </>
  )
}
