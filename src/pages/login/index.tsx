import LoginPage from "../../components/LoginPage";
import Layout from "./layout";
import { Box, Grid } from "@mui/material";
import TitleBox from "../../components/TitleBox";

export default () => {
  return (
    <Layout>
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
          <LoginPage />

          <TitleBox />
        </Grid>
        {/* GRID SYSTEM END */}
      </Box>
    </Layout>
  );
};
