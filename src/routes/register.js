import styles from '../styles/routes/register.module.css'
import {Alert, Button, Snackbar, TextField} from '@mui/material'
import {useRef, useState} from 'react'
import Auth from '../util/auth'
import {useNavigate} from 'react-router'
import {Link} from 'react-router-dom'

export default function Register() {
  const [snackbarObject, setSnackbarObject] = useState({})
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmationRef = useRef()
  const navigate = useNavigate()
  const passwordMinLength = 6 // The default length for password in Strapi
  const emailErrorArray = ['input', 'email']
  const passErrorArray = ['input', 'pass', 'eq']

  /**
   * The **registerUser** function registers the user based on the email and password given in UI.<br>
   * This function does not validate the user credentials. The credentials have to be validated before invoking this
   * function.
   *
   * @async
   * @returns {Promise<void>}
   */
  async function registerUser() {
    // The response and the including JWT are ignored. @see requirements
    const response = await Auth.register({
      email: emailRef.current.value.trim(),
      password: passwordRef.current.value
    })

    if (Object.keys(response).includes('error')) {
      handleSnackbar({open: true, id: 'input', message: response.error.message, severity: 'error'})
    } else {
      navigate('/login')
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
      <div className={styles.container}>
        <div className={styles.logo}/>
        <h1 children={'App Name'}/>
        <p className={styles.register}>
          You have an account?
          <Link to={'/login'} className={styles.registerLink} children={'login'}/>
        </p>
        <div className={styles.form}>
          <TextField
            fullWidth
            required
            error={(emailErrorArray.includes(snackbarObject.id)) && snackbarObject.severity === 'error'}
            id="email"
            label="Email"
            type="email"
            variant="standard"
            inputRef={emailRef}
          />
          <TextField
            fullWidth
            required
            error={(passErrorArray.includes(snackbarObject.id)) && snackbarObject.severity === 'error'}
            id="password"
            label="Password"
            type="password"
            variant="standard"
            inputRef={passwordRef}
            inputProps={{minLength: passwordMinLength}}
          />
          <TextField
            fullWidth
            required
            error={(passErrorArray.includes(snackbarObject.id)) && snackbarObject.severity === 'error'}
            id="password-confirmation"
            label="Confirm Password"
            type="password"
            variant="standard"
            inputRef={passwordConfirmationRef}
            inputProps={{minLength: passwordMinLength}}
          />
          <Button
            variant="contained"
            children={'Register'}
            sx={{marginTop: '4rem'}}
            onClick={handleSubmit}
          />
        </div>
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
