import { Box, Divider, Grid, Typography } from "@mui/material";
import type { FormikValues } from "formik";
import PatientsDetails from "./PatientsDetails";

const ClinicsCopy = (props: FormikValues) => {
  return (
    <Box width={"50vh"} justifyContent={"center"}>
      <Typography
        sx={{
          fontFamily: "Times New Roman",
          fontSize: 20,
          textDecoration: "underline",
          textAlign: "center",
        }}
        mb={2}
      >
        CLINIC'S COPY
      </Typography>
      <PatientsDetails {...props} />
      <Grid
        container
        size={{ xs: 12 }}
        textAlign={"center"}
        mt={3}
        justifyContent={"center"}
      >
        <Grid size={{ xs: 10 }} mt={5}>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: "bold",
              letterSpacing: 2,
              textAlign: "left",
              mb: 1,
            }}
          >
            NOTED:
          </Typography>
          <Typography
            textAlign={"center"}
            sx={{ fontSize: 14, fontWeight: "bold", letterSpacing: 2 }}
          >
            {import.meta.env.VITE_APP_STAFF_NAME}
          </Typography>
          <Typography
            textAlign={"center"}
            sx={{ fontSize: 14, letterSpacing: 2 }}
          >
            {import.meta.env.VITE_APP_STAFF_POS}
          </Typography>
          <Typography
            textAlign={"center"}
            sx={{ fontSize: 14, fontWeight: "normal", letterSpacing: 2 }}
          >
            {import.meta.env.VITE_APP_HOSPITAL_NAME}
          </Typography>
        </Grid>
      </Grid>
      <Divider
        sx={{
          my: 2,
          mb: 1,
          borderBottomWidth: "medium",
          borderColor: "black",
          width: "auto",
        }}
      />
    </Box>
  );
};

export default ClinicsCopy;
