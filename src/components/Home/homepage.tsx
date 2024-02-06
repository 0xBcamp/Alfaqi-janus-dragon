import React from "react";
import { Button, Box, Typography, Card } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SickIcon  from "@mui/icons-material/Sick";


const HomePage: React.FC = () => {
  const buttonStyle = {
    backgroundColor: "#233044",
    color: "white",
    fontSize: "1.25rem", // Increase font size for better visibility
    padding: "10px 24px", // Increase padding for a larger button
  };

  const cardStyle = {
    backgroundColor: "#2C3E50", // Darker shade for contrast
    color: "white",
    padding: "20px", // Add some padding inside the card
    textAlign: "center", // Center text inside the card
    width: "100%", // Take full width to ensure it's centered
    maxWidth: "600px", // Max width for better control of card size
    margin: "20px", // Add margin around the card for spacing
  };

  const textStyle = {
    color: "white", // Ensures text color is white
    textAlign: "center", // Centers the text
    width: "100%", // Ensures the text spans the full width of its container
    textShadow: "2px 2px 4px #000000",
    fontweight: "bold"
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh" // Use 100vh to ensure full screen height
    >
        <Typography variant="h3" component="h2" gutterBottom style={textStyle}>
          Welcome! <br/> To get you onboard, let's take a glimpse of what awaits you here.
        </Typography>
        <Typography variant="h3" component="h2" gutterBottom style={textStyle}>
          Are you a:
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
            onClick={() => window.location.href = '/doctor'}
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
            onClick={() => window.location.href = '/patient'}
          >
            Patient
          </Button>
        </Card>
      </Box>
    </Box>
  );
};

export default HomePage;
