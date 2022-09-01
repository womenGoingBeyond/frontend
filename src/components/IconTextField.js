import TextField from "@mui/material/TextField";
import InputAdornment from '@mui/material/InputAdornment';
import styles from '../styles/components/IconTextField.module.css'

const IconTextField = ({ marginTop, iconStart, iconEnd, ...props }) => {
    return (
      <TextField 
        {...props}
        variant="outlined"
        className="{styles.textField}"
        sx={{
          marginTop: marginTop ? marginTop : "0px",
          "& .MuiOutlinedInput-root.Mui-focused": {
            "& > fieldset": {
            backgroundColor: "#0000000a",
            }
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#0000003a',
              borderWidth: '0.5px',
            },
            '&:hover fieldset': {
              borderColor: '#0000003a',
              borderWidth: '0.5px',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0000003a',
              borderWidth: '0.5px',
            },
          },
        }}
        InputProps={{
          className: styles.input,
          startAdornment: iconStart ? (
            <InputAdornment position="start">{iconStart}</InputAdornment>
          ) : null,
          endAdornment: iconEnd ? (
            <InputAdornment position="end">{iconEnd}</InputAdornment>
          ) : null
        }}
      />
    );
  };
  export default IconTextField;