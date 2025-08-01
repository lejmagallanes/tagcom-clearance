import { Box, Divider, Grid, Typography } from "@mui/material";
import type { FormikValues } from "formik";
import { observer } from "mobx-react-lite";
import PatientsDetails from "./PatientsDetails";

const PatientsCopy = (props: FormikValues) => {
  return (
    <Box justifyContent={"center"}>
      <img src="/tagcom_logo.png" width={350} />
      <Divider
        sx={{ my: 2, borderBottomWidth: "medium", borderColor: "black" }}
      />
      <Typography
        sx={{
          fontFamily: "Times New Roman",
          fontSize: 20,
          textDecoration: "underline",
          textAlign: "center",
        }}
        mb={2}
      >
        PATIENT'S COPY
      </Typography>
      <PatientsDetails {...props} />
      <Grid container size={{ xs: 12 }} textAlign={"center"} mt={3}>
        <Grid size={{ xs: 12 }}>
          <Typography
            sx={{ fontFamily: "Times New Roman" }}
            fontWeight={"bold"}
            letterSpacing={1.5}
            fontSize={22}
            textAlign={"justify"}
            mb={5}
          >
            This certifies that the patient has no more pending amount to settle
            in the clinic and is cleared for discharge.
          </Typography>
        </Grid>
        <Grid size={{ xs: 12 }} justifyContent={"center"}>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: "bold",
              letterSpacing: 2,
              textAlign: "left",
              mb: 1,
            }}
          >
            SIGNED:
          </Typography>
          <img src="/doc_sign.png" width={350} />
        </Grid>
        <Grid size={{ xs: 12 }} mt={5} sx={{ justifyContent: "center" }}>
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
    </Box>
  );
};

export default observer(PatientsCopy);
