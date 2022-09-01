import TextField from "@mui/material/TextField";
import styles from '../styles/components/IconTextField.module.css'

const DateTextField = ({ marginTop, iconStart, iconEnd, ...props }) => {
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
          "& .Mui-focused": {
            color: "#444",  
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
      />
    );
  };
  export default DateTextField;