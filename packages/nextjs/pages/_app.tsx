import { Box, Grid } from "@mui/material";
import SigninPage from "./SigninPage";
import TitleBox from "./TitleBox";
import MainLayout from "./MainLayout";


const App: React.FC = () => {
  return (
    <MainLayout>
      <Box
        sx={{
          width: {
            sm: "90vw",
            xs: "90vw",
            md: "60vw",
            lg: "60vw",
            xl: "60vw",
          },
        }}
      >
        {/* GRID SYSTEM */}
        <Grid container height="90vh">
          <SigninPage />

          <TitleBox />
        </Grid>
        {/* GRID SYSTEM END */}
      </Box>
    </MainLayout>
  );
};

export default App;
