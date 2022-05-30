import { Button } from '@mui/material'

const CustomButton = ({  marginBottom, marginTop, marginRight, marginLeft, customColor, customBGHoverColor, customBGColor, ...props }) => {
    return (


        <Button
        {...props}
        variant="contained"
        
        sx={{ 
            height: "57px",
            marginTop: marginTop ? marginTop : '0rem' ,
            marginBottom: marginBottom ? marginBottom : '0rem' ,
            marginLeft: marginLeft ? marginLeft : "0px",
            marginRight: marginRight ? marginRight : "0px",
            color: customColor ? customColor : "#fff",
            backgroundColor: customBGColor ? customBGColor : "#ce6328",
            ':hover': {
                bgcolor: customBGHoverColor ? customBGHoverColor: '#db753e',
            },
        }}
      />

    );
  };
  export default CustomButton;