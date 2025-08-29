import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useFormik, type FormikValues, type FormikProps } from "formik";
import { observer } from "mobx-react-lite";
import { clearanceValidation } from "../../services/formikValidations";
import { useMemo, useState } from "react";
import axiosClient from "../../services/axiosClient";
import OpenClearanceContent from "./OpenClearanceContent";

type ClearanceFormProps = {
  item?: any;
  closeCFDialog?: () => void;
  setReload?: React.Dispatch<React.SetStateAction<boolean>>;
};

const ClearanceForm: React.FC<ClearanceFormProps> = ({
  item = {},
  closeCFDialog = () => {},
  setReload,
}) => {
  const [openClearanceDialog, setOpenClearanceDialog] = useState(false);
  const initialValues = useMemo(() => {
    if (Object.keys(item).length) {
      return {
        datetime: dayjs(item?.datetime),
        name: item?.name,
        age: item?.age,
        sex: item?.sex,
        amount: item?.amount,
      };
    }

    return {
      datetime: dayjs(),
      name: "",
      age: "0",
      sex: "Male",
      amount: "0",
    };
  }, [item]);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: clearanceValidation,
    enableReinitialize: true,
    onSubmit: (values: FormikValues) => {
      const updatedValues = {
        ...values,
        name: values.name.toUpperCase(),
      };

      if (Object.keys(item).length !== 0) {
        axiosClient
          .put(`/clearance/${item?.id}`, updatedValues)
          .then(() => {
            closeCFDialog();
            setReload?.(true);
          })
          .catch((error: any) => {
            if (error?.response?.data?.errors) {
              formik.setErrors(error?.response?.data?.errors);
            }
          });
        return;
      }

      formik.setValues(updatedValues);
      setOpenClearanceDialog(true);
    },
  });

  const handleDateChange = (newDate: Dayjs | null) => {
    if (newDate) {
      formik.setValues((prev: any) => ({
        ...prev,
        datetime: newDate,
      }));
    }
  };

  const formikErrorBool = (val: string) => {
    return formik.touched[val] && Boolean(formik.errors[val]);
  };

  const formikErrorMsg = (val: string) => {
    return <>{formik.touched[val] && formik.errors[val]}</>;
  };

  return (
    <Box p={5} pt={0} width={"80vh"} className="clearance-form">
      <form onSubmit={formik.handleSubmit}>
        <Typography variant="h6" pb={3}>
          Please fill in the following patient's information:
        </Typography>
        <Stack spacing={2}>
          <Grid container size={12} spacing={2} justifyContent={"center"}>
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
                  name="datetime"
                  value={formik.values.datetime}
                  disabled={Object.keys(item).length !== 0 ? false : true}
                  onChange={handleDateChange}
                />
              </LocalizationProvider>
            </Grid>

            {/* Name - full width */}
            <Grid size={12}>
              <TextField
                id="name"
                fullWidth
                label="Name"
                variant="outlined"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                slotProps={{
                  htmlInput: {
                    style: { textTransform: "uppercase" },
                  },
                }}
                error={formikErrorBool("name")}
                helperText={formikErrorMsg("name")}
              />
            </Grid>

            {/* Age - half width */}
            <Grid size={4}>
              <TextField
                id="age"
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
                value={formik.values.age}
                onChange={formik.handleChange}
                error={formikErrorBool("age")}
                helperText={formikErrorMsg("age")}
              />
            </Grid>

            <Grid container size={8}>
              <FormLabel id="demo-row-radio-buttons-group-label">Sex</FormLabel>
              <RadioGroup
                id="sex"
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="sex"
                value={formik.values.sex || "Male"}
                onChange={formik.handleChange}
              >
                <FormControlLabel
                  value="Male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="Female"
                  control={<Radio />}
                  label="Female"
                />
              </RadioGroup>
            </Grid>

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
                  type="number"
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  error={formikErrorBool("amount")}
                />
                {formikErrorMsg("amount") && (
                  <FormHelperText error>
                    {formikErrorMsg("amount")}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </Stack>
        <Grid sx={{ textAlign: "right" }}>
          <Button
            variant="contained"
            sx={{ width: "25vh", mt: 5, alignSelf: "right" }}
            type="submit"
          >
            {item?.id ? "Save Changes" : "Save"}
          </Button>
        </Grid>
      </form>
      {/* dialog for clearance printer */}
      <OpenClearanceContent
        open={openClearanceDialog}
        onClose={() => setOpenClearanceDialog(false)}
        formValues={formik.values}
        formik={formik}
      />
    </Box>
  );
};

export default observer(ClearanceForm);
