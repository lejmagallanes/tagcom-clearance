const ClearanceForm = () => {
  return (
    <>
      <Grid container>
        <Grid size={12} sx={{ m: 5 }} justifyContent={"center"}>
          <img src="/tagcom_logo.png" width={350} />
        </Grid>
      </Grid>
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
                  disabled
                  name="datetime"
                  value={formik.values.datetime}
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
            variant="outlined"
            sx={{ width: "20vh", mt: 5, alignSelf: "right" }}
            type="submit"
          >
            View Clearance Slip
          </Button>
        </Grid>
      </form>
    </>
  );
};
