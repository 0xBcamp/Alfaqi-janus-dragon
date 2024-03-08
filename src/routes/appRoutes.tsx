import { RouteType } from "./config";
import HomeIcon from "@mui/icons-material/Home";
import ContactIcon from "@mui/icons-material/ContactMail";
import LoginIcon from "@mui/icons-material/Login";
import SearchIcon from "@mui/icons-material/Search";
import PatientIcon from "@mui/icons-material/LocalHospital";
import DoctorIcon from "@mui/icons-material/MedicalServices";
import HowToRegIcon from '@mui/icons-material/HowToReg';

const appRoutes: RouteType[] = [
  {
    index: true,
    state: "home",
  },
  {
    path: "/home",
    state: "home",
    sidebarProps: {
      displayText: "Homepage",
      icon: <HomeIcon />,
    },
  },
  {
    path: "/login",
    state: "login",
    sidebarProps: {
      displayText: "Login",
      icon: <LoginIcon />,
    },
  },
  {
    path: "/patient",
    state: "patient.dashboard",
    sidebarProps: {
      displayText: "Patient Dashboard",
      icon: <PatientIcon />,
    },
  },
  {
    path: "/doctor",
    state: "doctor.dashboard",
    sidebarProps: {
      displayText: "Doctor Dashboard",
      icon: <DoctorIcon />,
    },
    role: ["doctor"],
  },
  {
    path: "/search-doctors",
    state: "search-doctors",
    sidebarProps: {
      displayText: "Search Doctors",
      icon: <SearchIcon />,
    },
  },
  {
    path: "/contact",
    state: "contact",
    sidebarProps: {
      displayText: "Team contact",
      icon: <ContactIcon />,
    },
  },
  {
    path: "/appointment",
    state: "appointment",
    sidebarProps: {
      displayText: "Appointment",
      icon: <HowToRegIcon />,
    },
  },
];

export default appRoutes;
