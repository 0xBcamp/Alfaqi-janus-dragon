import React from "react";
import { Button, Box, Typography, Card, InputBase } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SickIcon  from "@mui/icons-material/Sick";
import NavigateNext from "@mui/icons-material/NavigateNext";
import { useUserData } from "../userDataContext";
import Link from "next/link";


const HomePage: React.FC = () => {
  const buttonStyle : React.CSSProperties = {
    backgroundColor: "#233044",
    color: "white",
    fontSize: "1.25rem", // Increase font size for better visibility
    padding: "10px 24px", // Increase padding for a larger button
  };

  const cardStyleTitles : React.CSSProperties = {
    backgroundColor: "#2C3E50", // Darker shade for contrast
    color: "white",
    padding: "20px", // Add some padding inside the card
    textAlign: "center", // Center text inside the card
    margin: "20px", // Add margin around the card for spacing
  };

  const cardStyle : React.CSSProperties = {
    backgroundColor: "#2C3E50", // Darker shade for contrast
    color: "white",
    padding: "20px", // Add some padding inside the card
    textAlign: "center", // Center text inside the card
    width: "100%", // Take full width to ensure it's centered
    maxWidth: "600px", // Max width for better control of card size
    margin: "20px", // Add margin around the card for spacing
  };

  const textStyle : React.CSSProperties = {
    color: "white", // Ensures text color is white
    textAlign: "center", // Centers the text
    width: "100%", // Ensures the text spans the full width of its container
    textShadow: "2px 2px 4px #000000",
    fontWeight: "bold" // Corrected typo in fontWeight property
  };

  const subTextStyle: React.CSSProperties = {
    color: "white", // Ensures text color is white
    textAlign: "center", 
    width: "80%", 
    textShadow: "1px 1px 2px #000000",
  };

  const { userData } = useUserData();

  // Update userData
  const updateAlias = (newAlias: string) => {
    userData.alias = newAlias;
  };

  const updateIsDoctor = (newIsDoctor) => {
    userData.isDoctor = newIsDoctor;
  };

  const updateIsPatient = (newIsPatient) => {
    userData.isPatient = newIsPatient;
  };
  
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh" // Use 100vh to ensure full screen height
    >
      <Card style={{...cardStyleTitles}}>
        <Typography variant="h3" component="h2" gutterBottom style={textStyle}>
          Welcome! <br/> To get you onboard, we need to get some info about you. <br/> Answer the following questions and then click on the button below to proceed.
        </Typography>
      </Card>
        <Typography variant="h4" component="h3" gutterBottom style={subTextStyle}>
          Are you a patient or a doctor?
        </Typography>

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={2} // Maintain gap between buttons
        >
          <Card style={{ ...cardStyle, display: 'inline-block' }}>
            <Button
              variant="contained"
              startIcon={<AccountCircle />}
              size="large"
              style={buttonStyle}
              onClick={() => {updateIsDoctor(true); updateIsPatient(false)}}
            >
              Doctor
            </Button>
          </Card>
          <Card style={{ ...cardStyle, display: 'inline-block' }}>
            <Button
              variant="contained"
              startIcon={<SickIcon />}
              size="large"
              style={buttonStyle}
              onClick={() => {updateIsPatient(true); updateIsDoctor(false)}}
            >
              Patient
            </Button>
          </Card>
        </Box>
        <Typography variant="h4" component="h3" gutterBottom style={subTextStyle}>
          How do you want to be called?
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
        <InputBase
          placeholder="User"
          onChange={(event) => updateAlias(event.target.value)}
          fullWidth
          sx={{
            bgcolor: "white",
            p: 1,
            borderRadius: "2px",
            color: "black", // Add this line to set the text color to black
          }}
        />
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Link href="/login" passHref>
            <Button
              variant="contained"
              startIcon={<NavigateNext />}
              size="large"
              style={buttonStyle}
            >
              Proceed
            </Button>
          </Link>
        </Box>
    </Box>
  );
};

export default HomePage;
