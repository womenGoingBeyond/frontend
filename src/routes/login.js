import styles from '../styles/routes/login.module.css'
import {Alert, Button, Snackbar, TextField} from '@mui/material'
import {useRef, useState} from 'react'
import Auth from '../util/auth'
import {useNavigate} from 'react-router'
import {Link} from 'react-router-dom'

export default function Login() {
  const [snackbarObject, setSnackbarObject] = useState({})
  const emailRef = useRef()
  const passwordRef = useRef()
  const navigate = useNavigate()

  /**
   *
   * @param {object} credentials
   * @returns {Promise<void>}
   */
  async function loginUser({email, password}) {
    const response = await Auth.login({
      identifier: email,
      password: password
    })
    if ('error' in response.data) {
      //TODO: invoke handleSnackbar for err msg
      console.log('wrong credentials', response.data)
    } else {
      window.localStorage.setItem('wgb-jwt', response.data.jwt)
      navigate('/courses')
    }
  }

  /**
   *
   */
  function handleSubmit() {
    const email = emailRef.current.value, password = passwordRef.current.value
    const isValid = validateInput({email: emailRef.current, password: passwordRef.current})
    isValid && loginUser({email, password}).catch(console.error)
  }

  /**
   *
   * @param {string} email
   * @param {string} password
   * @returns {boolean}
   */
  function validateInput({email, password}) {
    if (email.validity.valueMissing || password.validity.valueMissing) {
      handleSnackbar({open: true, message: 'Please give an email/password.', severity: 'error'})
      return false
    }
    if (!email.validity.valid) {
      handleSnackbar({open: true, message: 'email is not valid', severity: 'error'})
      return false
    }
    if (password.validity.tooShort) {
      handleSnackbar({open: true, message: 'too short password', severity: 'error'})
      return false
    }

    handleSnackbar({open: snackbarObject.open, message: '', severity: 'success'})
    return true
  }

  /**
   *
   */
  function handleCloseSnackbar() {
    handleSnackbar({
      open: false, message: '', severity: snackbarObject.severity
    })
  }

  /**
   *
   * @param open
   * @param message
   * @param severity
   */
  function handleSnackbar({open, message, severity}) {
    setSnackbarObject({open, message, severity})
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.logo}/>
        <h1 children={'App Name'}/>
        <p className={styles.register}>
          Don't have an account?
          <Link to={'/register'} className={styles.registerLink}>register</Link>
        </p>
        {/* TODO: use Stack for form elements */}
        <div className={styles.form}>
          <TextField
            fullWidth
            required
            error={snackbarObject.severity === 'error'}
            id="email"
            label="Email"
            type="email"
            variant="standard"
            inputRef={emailRef}
          />
          <TextField
            fullWidth
            required
            error={snackbarObject.severity === 'error'}
            id="password"
            label="Password"
            type="password"
            variant="standard"
            inputRef={passwordRef}
            inputProps={{minLength: 4}}
          />
          <Button
            variant="contained"
            children={'Login'}
            sx={{marginTop: '4rem'}}
            onClick={handleSubmit}
          />
        </div>
      </div>
      <Snackbar
        open={snackbarObject.open}
        autoHideDuration={3000}
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
