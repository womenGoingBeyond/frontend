import styles from '../styles/routes/login.module.css'
import { Alert, Button, Snackbar, TextField } from '@mui/material'
import { useRef, useState } from 'react'

export default function Login() {
  const [snackbarObject, setSnackbarObject] = useState({})
  const emailRef = useRef()
  const passwordRef = useRef()

  const loginUser = ({email, password}) => {
    const TYPE = 'sfwd-courses'
    const URL = `${process.env.REACT_APP_WP_DOMAIN}/${process.env.REACT_APP_LD_EXT}/${TYPE}`

    fetch(URL, {
      mode: 'no-cors'
    })
      .then(response => response.json())
      .then(data => {
        for (const course of data) {
          console.log('course', course)
        }
      })
      .catch(console.error)

    console.log('login')
  }

  const handleSubmit = () => {
    const email = emailRef.current.value, password = passwordRef.current.value
    const isValid = validateInput({email: emailRef.current, password: passwordRef.current})
    isValid && loginUser({email, password})
  }

  const validateInput = ({email, password}) => {
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

  const handleCloseSnackbar = () => handleSnackbar({
    open: false, message: '', severity: snackbarObject.severity
  })
  const handleSnackbar = ({open, message, severity}) => {
    setSnackbarObject({open, message, severity})
  }

  return (<>
    <div className={styles.container}>
      <div className={styles.logo}/>
      <h1 children={'App Name'}/>
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
          inputProps={{minLength: 6}}
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
  </>)
}
