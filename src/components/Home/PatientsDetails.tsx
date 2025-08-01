import { Typography, styled, type TypographyProps, Grid } from "@mui/material";
import type { FormikValues } from "formik";
import { observer } from "mobx-react-lite";
import { RealTimeDateTime } from "../../pages/Private/Home";

const StyledPatientDetails = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "primary",
})<TypographyProps>(() => ({
  fontFamily: "Times New Roman",
  fontSize: 20,
  textAlign: "left",
  textTransform: "uppercase",
}));

const PatientDetails = ({ name, age, sex, clinic, amount }: FormikValues) => {
  return (
    <Grid container>
      <Grid size={12} sx={{ p: 0.5 }}>
        <StyledPatientDetails>
          DATE: <RealTimeDateTime />
        </StyledPatientDetails>
      </Grid>
      <Grid size={12} sx={{ p: 0.5 }}>
        <StyledPatientDetails>PATIENT NAME: {name}</StyledPatientDetails>
      </Grid>
      <Grid size={12} sx={{ p: 0.5 }}>
        <StyledPatientDetails>
          AGE/SEX: {age}/{sex}
        </StyledPatientDetails>
      </Grid>
      {clinic && (
        <Grid size={12} sx={{ p: 0.5 }}>
          <StyledPatientDetails>TOTAL AMOUNT: {amount}</StyledPatientDetails>
        </Grid>
      )}
    </Grid>
  );
};

export default observer(PatientDetails);
