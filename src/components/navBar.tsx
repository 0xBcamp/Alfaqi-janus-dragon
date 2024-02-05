import React from "react";
import { useAuth } from "./authContext";
import {
  Drawer,
  List,
  ListItemButton,
  Toolbar,
  Stack,
  Avatar,
} from "@mui/material";
import colorConfigs from "./configs/colorConfigs";
import sizeConfigs from "./configs/sizeConfigs";
import appRoutes from ".././routes/appRoutes";
import NavBarItem from "./navBarItem";

const NavBar = () => {
  const { user, logout } = useAuth(); // Correctly access the logout function

  const filteredRoutes = appRoutes.filter((route) => {
    if (user && route.role.includes(user.role)) return true;
    if (!user) return true;
    return false;
  });

  return (
    <div>
      <Drawer
        variant="permanent"
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
        <List disablePadding>
          <Toolbar sx={{ marginBottom: "20px" }}>
            <Stack
              sx={{ width: "100%" }}
              direction="row"
              justifyContent="center"
            >
              <Avatar />
            </Stack>
          </Toolbar>
          {filteredRoutes.map((route, index) => (
            <NavBarItem item={route} key={index} />
          ))}
          {user && (
            <ListItemButton
              onClick={logout}
              sx={{ paddingY: "12px", paddingX: "24px" }}
            >
              Logout {/* Ideally, include an icon here */}
            </ListItemButton>
          )}
        </List>
      </Drawer>
    </div>
  );
};

export default NavBar;
