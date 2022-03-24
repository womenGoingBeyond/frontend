import styles from '../styles/routes/login.module.css'
import { Alert, Button, Snackbar, TextField } from '@mui/material'
import { useRef, useState } from 'react'
import auth from '../components/Auth'
import { useNavigate } from 'react-router'

export default function Login() {
  const [snackbarObject, setSnackbarObject] = useState({})
  const emailRef = useRef()
  const passwordRef = useRef()
  const navigate = useNavigate()

  const loginUser = async () => {
    const {jwt, success} = await auth({email: emailRef.current.value, password: passwordRef.current.value})
    if (success) {
      // TODO: redirect to list courses
      window.localStorage.setItem('wgb-jwt', jwt)
      navigate('/courses')
    } else {
      console.log('wrong credentials')
      // TODO: invoke handleSnackbar for err msg
    }
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
  </>)
}
