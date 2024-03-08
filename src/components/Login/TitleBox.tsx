import { Box, Typography, Grid } from "@mui/material";
import React from 'react';

const textStyle : React.CSSProperties = {
  color: "white", // Ensures text color is white
  textAlign: "center", // Centers the text
  width: "100%", // Ensures the text spans the full width of its container
  textShadow: "2px 2px 4px #000000",
  fontWeight: "bold"
};


const TitleBox: React.FC = () => {
  return (
    <Grid item xs={0} sm={0} md={6} lg={6} xl={6} minHeight={550}>
      <Box
        sx={{
          backgroundImage: `linear-gradient(135deg, rgba(0, 255, 60, 0.3) , rgba(0, 157, 255, 0.3))`,
          padding: "20px",
          display: {
            xs: 'none',
            sm: 'none',
            md: 'flex',
            lg: 'flex', 
            xl: 'flex'
          },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          borderRadius: "0px 30px 30px 0",
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="flex-start"
        >
          <Typography variant="h4" style={textStyle} mb={2}>
            Join us to revolutionize the Healthcare Industry!
          </Typography>
          <Typography variant="body1" style={textStyle} color="white">
            Easily create your account and start using our services.
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
};

export default TitleBox;
