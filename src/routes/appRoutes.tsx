import HomePage from "../components/Home/homepage";
import PatientDashboard from "../components/Patient/dashboard";
import DoctorDashboard from "../components/Doctor/dashboard";
import LoginPage from "../components/LoginPage";
import TitleBox from "../components/TitleBox";
import ContactForm from "../components/Contact/contactForm";
import SearchDoctorsPage from "../components/SearchDoctors/searchDoctors";
import { Box, Grid } from "@mui/material";
import { RouteType } from "./config";

import HomeIcon from '@mui/icons-material/Home';
import ContactIcon from '@mui/icons-material/ContactMail';
import LoginIcon from '@mui/icons-material/Login';
import SearchIcon from '@mui/icons-material/Search';
import PatientIcon from '@mui/icons-material/LocalHospital';
import DoctorIcon from '@mui/icons-material/MedicalServices';


const appRoutes: RouteType[] = [
  {
    index: true,
    element: <HomePage/>,
    state: "home"
  },
  {
    path: "/home",
    element: <HomePage/>,
    state: "home",
    sidebarProps: {
      displayText: "Homepage",
      icon: <HomeIcon/>
    }
  },
  {
    path: "/login",
    element: <Box
    sx={{
      width: {
        sm: '90vw',
        xs: '90vw',
        md: '60vw',
        lg: '60vw',
        xl: '60vw',
      },
    }}
    >
    <Grid container height="90vh">
      <LoginPage />
      <TitleBox />
    </Grid>
    </Box>,
    state: "login",
    sidebarProps: {
      displayText: "Login",
      icon: <LoginIcon/>
    }
  },
  {
    path: "/patient/dashboard",
    element: <PatientDashboard />,
    state: "patient.dashboard",
    sidebarProps: {
      displayText: "Patient Dashboard",
      icon: <PatientIcon />
    },
    role: ["patient"]
  },
  {
    path: "/doctor/dashboard",
    element: <DoctorDashboard />,
    state: "doctor.dashboard",
    sidebarProps: {
      displayText: "Doctor Dashboard",
      icon: <DoctorIcon />
    },
    role: ["doctor"]
  },
  {
    path: "/search-doctors",
    element: <SearchDoctorsPage/>,
    state: "search-doctors",
    sidebarProps: {
    displayText: "Search Doctors",
    icon: <SearchIcon/>
    }
  },
  {
    path: "/contact",
    element: <ContactForm/>,
    state: "contact",
    sidebarProps: {
      displayText: "Team contact",
      icon: <ContactIcon/>
    }
  }
];

export default appRoutes;