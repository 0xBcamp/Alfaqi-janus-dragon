import LoginPage from "../../components/Login/LoginPage";
import Layout from "../../components/Login/LoginLayout";
import { Box, Grid } from "@mui/material";
import Image from "next/image";
import TitleBox from "../../components/Login/TitleBox";
import bgImage from "../../public/bg1.svg";


export default () => {
  return (
    <div className="p-4">
      <Image
        src={bgImage}
        alt="background"
        fill
        sizes="100vw"
        style={{
          objectFit: "cover",
          zIndex: -1,
        }}
      />
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
  </div>
  );
};
