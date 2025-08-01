import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  CssBaseline,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { userStore } from "../../stores/userstore";
import axiosClient from "../../services/axiosClient";

const Login = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  const { setUser, setToken, setSessionMessage } = userStore;
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "admin@tagcom.com",
      password: "@magMa1234",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: (values: any) => {
      axiosClient
        .post("/login", values)
        .then(({ data }) => {
          localStorage.setItem("ACCESS_TOKEN", data.token);
          localStorage.setItem("user", data.user.name);
          setUser(data.user);
          setToken(data.token);
          setSessionMessage("");
          navigate("/home");
        })
        .catch((error: any) => {
          console.log("error", error);
        });
    },
  });
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh", pt: 6 }}
    >
      <CssBaseline />
      <Grid size={12} mb={5}>
        <img src="/tagcom_logo.png" width={350} />
      </Grid>
      <Grid size={12}>
        <Typography variant="h4">Welcome Back!</Typography>
      </Grid>

      <Grid size={12} sx={{ mt: 4, width: "100%", maxWidth: 400 }}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={5} margin={"auto"}>
            <Grid size={12}>
              <Typography variant="h5"></Typography>
            </Grid>
            <Stack spacing={2}>
              <Grid container size={12} spacing={3} justifyContent={"center"}>
                <Grid size={12}>
                  <TextField
                    label="Email"
                    defaultValue=""
                    variant="outlined"
                    name="email"
                    type="email"
                    fullWidth
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <>{formik.errors.name}</>
                  ) : null}
                </Grid>
                <Grid size={12}>
                  <TextField
                    label="Password"
                    defaultValue=""
                    variant="outlined"
                    type="password"
                    name="password"
                    fullWidth
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <>{formik.errors.password}</>
                  ) : null}
                </Grid>
                <Button
                  type="submit"
                  variant="outlined"
                  sx={{ width: "20vh", mt: 5, alignSelf: "right" }}
                >
                  Login
                </Button>
              </Grid>
            </Stack>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

export default Login;
