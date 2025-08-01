import type { FormikProps, FormikValues } from "formik";
import { observer } from "mobx-react-lite";
import { render, Printer, Text, Br, Line, Image } from "react-thermal-printer";
import axiosClient from "../../services/axiosClient";
import axios from "axios";
import { Button, Divider, Grid } from "@mui/material";
import PatientsCopy from "./PatientsCopy";
import { RealTimeDateTime } from "../../pages/Private/Home";

interface PrintableReceiptProps {
  formValues: FormikValues;
  formik: FormikProps<FormikValues>;
  onClose: () => void;
}

const PrintableReceipt = ({
  formValues,
  formik,
  onClose,
}: PrintableReceiptProps) => {
  const handleConnect = async () => {
    try {
      function wrapLineByWords(text: string, max = 32): string {
        const words = text.split(" ");
        let lines: string[] = [];
        let currentLine = "";

        for (const word of words) {
          if ((currentLine + word).length > max) {
            lines.push(currentLine.trim());
            currentLine = word + " ";
          } else {
            currentLine += word + " ";
          }
        }

        if (currentLine.trim()) {
          lines.push(currentLine.trim());
        }

        return lines.join("\n");
      }

      const buffer = await render(
        <Printer type="epson">
          <Image align="center" src={`/tagcom_logo_ticket.png`} />
          <Br />
          <Br />
          <Text align="center" style={{ wordBreak: "break-word" }}>
            PATIENT'S COPY
          </Text>
          <Br />
          <Text align="left" size={{ height: 1, width: 1 }}>
            DATE: <RealTimeDateTime />
          </Text>
          <Br />
          <Text align="left" size={{ height: 1, width: 1 }}>
            PATIENT NAME: {wrapLineByWords(formValues.name)}
          </Text>
          <Br />
          <Text align="left" size={{ height: 1, width: 1 }}>
            AGE/SEX: {formValues.age}/{formValues.sex}
          </Text>
          <Br />
          <Br />
          <Text align="center">
            {wrapLineByWords(
              "This certifies that the patient has no more pending amount to settle in the clinic and is cleared for discharge."
            )}
          </Text>
          <Br />
          <Br />
          <Text align="left" bold={true}>
            Signed:
          </Text>
          <Image align="center" src={`/doc_sign.png`} />

          <Br />
          <Text align="left" bold>
            Noted:
          </Text>
          <Text align="center" bold={true}>
            {import.meta.env.VITE_APP_STAFF_NAME}
          </Text>
          <Text align="center">{import.meta.env.VITE_APP_STAFF_POS}</Text>
          <Text align="center" bold={true}>
            {import.meta.env.VITE_APP_HOSPITAL_NAME}
          </Text>
          <Br />
          <Line />
          <Br />
          <Br />
          <Text align="center" style={{ wordBreak: "break-word" }}>
            CLINIC'S COPY
          </Text>
          <Br />
          <Text align="left" size={{ height: 1, width: 1 }}>
            DATE: <RealTimeDateTime />
          </Text>
          <Br />
          <Text align="left" size={{ height: 1, width: 1 }}>
            PATIENT NAME: {formValues.name}
          </Text>
          <Br />
          <Text align="left" size={{ height: 1, width: 1 }}>
            AGE/SEX: {formValues.age}/{formValues.sex}
          </Text>
          <Br />
          <Text align="left" size={{ height: 1, width: 1 }}>
            TOTAL AMOUNT: {formValues.amount}
          </Text>
          <Br />
          <Br />
          <Text align="left" bold>
            Noted:
          </Text>
          <Text align="center" bold={true}>
            {import.meta.env.VITE_APP_STAFF_NAME}
          </Text>
          <Text align="center">{import.meta.env.VITE_APP_STAFF_POS}</Text>
          <Text align="center">{import.meta.env.VITE_APP_HOSPITAL_NAME}</Text>
          <Br />
          <Line />
          <Br />
        </Printer>
      );

      await axiosClient
        .post("/clearance", formValues)
        .then(() => {
          console.log("success storing");
          console.log(formik.initialValues);
          formik.setValues(formik.initialValues);
          console.log(JSON.stringify(formik.errors));
          formik.setStatus(formik.initialStatus);
          formik.resetForm();
          console.log("---after ser errors to blank");
          console.log(JSON.stringify(formik.errors));
        })
        .catch((error: any) => {
          console.log(error.response.data.errors);
          if (error.response.data.errors) {
            formik.setErrors(error.response.data.errors);
          }
        })
        .finally(() => {
          onClose();
        });

      await axios.post("http://localhost:3001/print", {
        data: Array.from(buffer),
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div
      style={{
        fontFamily: "Courier New",
        fontSize: "16px",
        margin: 0,
        padding: 0,
        width: "384px",
        backgroundColor: "white",
        color: "black",
      }}
    >
      <Grid container size={12}>
        {/* Patients Copy */}
        <Grid container spacing={2} mt={1}>
          <PatientsCopy {...formValues} />
        </Grid>

        {/* Clinics Copy */}
        <Divider
          sx={{
            my: 2,
            borderBottomWidth: "medium",
            borderColor: "black",
            width: "100%",
          }}
        />
        <Grid container spacing={2} mt={2} mb={5}>
          {/* <ClinicsCopy {...formValues} clinic={true} /> */}
        </Grid>
        <Grid container size={12} justifyContent={"center"}>
          <Button
            variant="outlined"
            onClick={handleConnect}
            sx={{ width: "20vh" }}
          >
            Print Clearance
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default observer(PrintableReceipt);
