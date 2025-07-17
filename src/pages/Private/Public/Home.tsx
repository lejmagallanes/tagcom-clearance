import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  Typography,
  styled,
  type TypographyProps,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import { toPng } from "html-to-image";
import moment from "moment";
import { useEffect, useState } from "react";
import { render, Printer, Text, Br, Line, Image } from "react-thermal-printer";

export async function renderReceiptToImage(): Promise<string | null> {
  const element = document.getElementById("receipt-content");
  if (!element) return null;

  try {
    const dataUrl = await toPng(element, {
      backgroundColor: "white",
      cacheBust: true,
    });
    return dataUrl; // base64 PNG
  } catch (err) {
    console.error("Failed to render receipt image:", err);
    return null;
  }
}

type FormValuesProps = {
  date: Dayjs;
  name: string;
  amount: string;
  age: string;
  sex: "Female" | "Male";
  clinic?: boolean;
};

const env = import.meta.env;

const Home = () => {
  const [formValues, setFormValues] = useState<FormValuesProps>({
    date: dayjs(),
    name: "",
    amount: "0",
    age: "0",
    sex: "Male",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (newDate: Dayjs | null) => {
    if (newDate) {
      setFormValues((prev) => ({
        ...prev,
        date: newDate,
      }));
    }
  };

  //handlePrint
  const handleConnect = async () => {
    // const buffer = await render(
    //   <Printer type="epson">
    //     <Text size={{ width: 2, height: 2 }} bold align="center" font="A">
    //       {env.VITE_APP_DOCTOR_LABEL}, {env.VITE_APP_DOCTOR_TITLE}
    //     </Text>
    //     <Br />
    //     <Line />
    //     <Text align="left">Thank you for your purchase!</Text>
    //     <Br />
    //   </Printer>
    // );

    // try {
    //   // Send buffer to Node.js backend
    //   await axios.post("http://localhost:3001/print", {
    //     data: Array.from(buffer),
    //   });
    //   console.log("Sent to printer successfully.");
    // } catch (err) {
    //   console.error("Print failed:", err);
    // }

    const imageDataUrl = await renderReceiptToImage();
    if (!imageDataUrl) return;

    const buffer = await render(
      <Printer type="epson">
        <Image src={imageDataUrl} />
      </Printer>
    );

    await axios.post("http://localhost:3001/print", {
      data: Array.from(buffer),
    });
  };

  return (
    <Box width={"90vh"} p={5}>
      <Typography variant="h6" pb={3}>
        Please fill in the following patient's information:
      </Typography>
      <FormControl>
        <Grid container spacing={2}>
          {/* Date - full width */}
          <Grid size={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date"
                defaultValue={dayjs()}
                slotProps={{
                  textField: {
                    helperText: "MM/DD/YYYY",
                    fullWidth: true,
                  },
                }}
                disabled
                name="date"
                value={formValues.date}
                onChange={handleDateChange}
              />
            </LocalizationProvider>
          </Grid>

          {/* Name - full width */}
          <Grid size={12}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              slotProps={{
                htmlInput: {
                  style: { textTransform: "uppercase" },
                },
              }}
            />
          </Grid>

          {/* Age - half width */}
          <Grid size={4}>
            <TextField
              fullWidth
              label="Age"
              variant="outlined"
              type="number"
              slotProps={{
                htmlInput: {
                  min: 0,
                },
              }}
              name="age"
              value={formValues.age}
              onChange={handleChange}
            />
          </Grid>

          {/* Sex - half width */}
          <Grid container size={8}>
            <FormLabel id="demo-row-radio-buttons-group-label">Sex</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="sex"
              value={formValues.sex || "Male"}
              onChange={handleChange}
            >
              <FormControlLabel
                value="Female"
                control={<Radio />}
                label="Female"
              />
              <FormControlLabel value="Male" control={<Radio />} label="Male" />
            </RadioGroup>
          </Grid>

          {/* Amount - full width */}
          <Grid size={12}>
            <FormControl fullWidth>
              <InputLabel htmlFor="outlined-adornment-amount">
                Amount
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                startAdornment={
                  <InputAdornment position="start">₱</InputAdornment>
                }
                label="Amount"
                fullWidth
                name="amount"
                value={formValues.amount}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid sx={{ textAlign: "right" }}>
          <Button
            variant="outlined"
            onClick={() => handleConnect()}
            sx={{ width: "20vh", mt: 5, alignSelf: "right" }}
          >
            Print Clearance
          </Button>
        </Grid>
        <PrintableReceipt {...formValues} />
      </FormControl>
    </Box>
  );
};

const StyledPatientDetails = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "primary",
})<TypographyProps>(() => ({
  fontFamily: "Times New Roman",
  fontSize: 20,
  textAlign: "left",
  textTransform: "uppercase",
}));

const PatientDetails = ({
  date,
  name,
  age,
  sex,
  clinic,
  amount,
}: FormValuesProps) => {
  const RealTimeDateTime = () => {
    const [dateState, setDateState] = useState(new Date());
    const t = new Date();
    useEffect(() => {
      setInterval(() => {
        setDateState(new Date());
      }, 1000);
    }, []);

    return <>{moment(dateState).format("MMMM DD, YYYY, h:mm:ss A")}</>;
  };

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

const PrintableReceipt = (formValues: FormValuesProps) => {
  return (
    <div id="receipt-content">
      <Grid container justifyContent={"center"}>
        {/* Patients Copy */}
        <Grid container spacing={2} mt={10}>
          <PatientsCopy {...formValues} />
        </Grid>

        {/* Clinics Copy */}
        <Divider
          sx={{
            my: 2,
            borderBottomWidth: "medium",
            borderColor: "black",
            width: "50vh",
          }}
        />
        <Grid container spacing={2} mt={2}>
          <ClinicsCopy {...formValues} clinic={true} />
        </Grid>
      </Grid>
    </div>
  );
};

const PatientsCopy = (props: FormValuesProps) => {
  return (
    <Box width={"50vh"}>
      <Typography
        textAlign={"center"}
        sx={{ fontSize: 12, fontWeight: "bold", letterSpacing: 2 }}
      >
        {env.VITE_APP_DOCTOR_LABEL}, {env.VITE_APP_DOCTOR_TITLE}
      </Typography>
      <Typography
        textAlign={"center"}
        sx={{ fontSize: 10, fontWeight: "normal", letterSpacing: 2 }}
      >
        {env.VITE_APP_DOCTOR_SPEC}
      </Typography>
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
      <PatientDetails {...props} />
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
            This certfies that the patient has no more pending amount to settle
            in the clinic and is cleared for discharge.
          </Typography>
        </Grid>
        <Grid size={{ xs: 10 }} justifyContent={"center"}>
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
          <Typography
            textAlign={"center"}
            sx={{ fontSize: 14, fontWeight: "bold", letterSpacing: 2 }}
          >
            {env.VITE_APP_DOCTOR_LABEL}, {env.VITE_APP_DOCTOR_TITLE}
          </Typography>
          <Typography
            textAlign={"center"}
            sx={{ fontSize: 10, fontWeight: "normal", letterSpacing: 2 }}
          >
            {env.VITE_APP_DOCTOR_SPEC}
          </Typography>
        </Grid>
        <Grid size={{ xs: 10 }} mt={10} sx={{ justifyContent: "center" }}>
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
            {env.VITE_APP_STAFF_NAME}
          </Typography>
          <Typography
            textAlign={"center"}
            sx={{ fontSize: 14, letterSpacing: 2 }}
          >
            {env.VITE_APP_STAFF_POS}
          </Typography>
          <Typography
            textAlign={"center"}
            sx={{ fontSize: 14, fontWeight: "normal", letterSpacing: 2 }}
          >
            {env.VITE_APP_HOSPITAL_NAME}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

const ClinicsCopy = (props: FormValuesProps) => {
  return (
    <Box width={"50vh"}>
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
      <PatientDetails {...props} />
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
            {env.VITE_APP_STAFF_NAME}
          </Typography>
          <Typography
            textAlign={"center"}
            sx={{ fontSize: 14, letterSpacing: 2 }}
          >
            {env.VITE_APP_STAFF_POS}
          </Typography>
          <Typography
            textAlign={"center"}
            sx={{ fontSize: 14, fontWeight: "normal", letterSpacing: 2 }}
          >
            {env.VITE_APP_HOSPITAL_NAME}
          </Typography>
        </Grid>
      </Grid>
      <Divider
        sx={{
          my: 2,
          borderBottomWidth: "medium",
          borderColor: "black",
          width: "50vh",
        }}
      />
    </Box>
  );
};

export default Home;
