import React from 'react';
import { Box, Toolbar, ThemeProvider } from "@mui/material";
import { theme } from "../theme";
import NavBar from '../../components/navBar';
import colorConfigs from "../../components/configs/colorConfigs"; 
import sizeConfigs from "../../components/configs/sizeConfigs"; 
import { Outlet } from '@mui/icons-material';

const MainLayout: React.FC<{ useBgImage?: boolean }> = ({ useBgImage = true }) => {
  const bgImage = require("../assets/bg.png");
  
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", height: "100vh" }}>
        <Box
          component="nav"
          sx={{
            width: sizeConfigs.sidebar.width,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: sizeConfigs.sidebar.width,
              boxSizing: "border-box",
              borderRight: "0px",
              backgroundColor: colorConfigs.sidebar.bg,
              color: colorConfigs.sidebar.color,
            },
          }}
        >
          <NavBar />
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: `calc(100% - ${sizeConfigs.sidebar.width})`,
            backgroundColor: colorConfigs.mainBg,
            backgroundImage: useBgImage ? `url(${bgImage})` : undefined,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            overflow: "hidden",
          }}
        >
          <Toolbar />
          {<Outlet/>} {/* This is where the nested routes will be rendered*/}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default MainLayout;