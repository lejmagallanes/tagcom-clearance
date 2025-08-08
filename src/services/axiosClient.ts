import axios from "axios";
import { observer } from "mobx-react";
import { userStore } from "../stores/userstore";
import router from "../routes/router";
import type { SnackbarProps } from "@mui/material";

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN");
  config.headers.Authorization = `Bearer ${token}`;
  config.params = {
    ...config.params,
  };
  return config;
});

var message = "";
var open = false;
var severity = "success";

axiosClient.interceptors.response.use(
  function (response: any) {
    message = "Transaction success.";
    severity = "success";
    open = true;
    switch (response.status) {
      case 204:
        if (["delete"].includes(response.config.method)) {
          userStore.setSnackBar({
            open: open,
            message: message,
            alert: {
              severity: severity,
            },
          });
        }
        break;
      case 200:
        if (["put", "post"].includes(response.config.method)) {
          if (response.data.message) message = response.data.message;
          userStore.setSnackBar({
            ...userStore.snackBar,
            open: open,
            message: message,
            alert: {
              severity: severity,
            },
          });
        }
        break;
      case 201:
        userStore.setSnackBar({
          ...userStore.snackBar,
          open: open,
          message: message,
          alert: {
            severity: severity,
          },
        });
        break;
    }

    return response;
  },
  function (error) {
    severity = "error";
    console.log(error);
    switch (error.status) {
      case 401:
        if (error.response.data.message) {
          message = error.response.data.message;
          open = true;
        }
        userStore.setToken(null);
        break;
      case 419:
        userStore.setSessionMessage(
          "Session token has expired. Please login again."
        );
        router.navigate("/login");
        break;
      case 403:
        router.navigate("/unauthorized");
        break;
      case 405:
        open = true;
        message = "Request method not allowed";
        break;
      case 422:
        open = true;
        message = error.response.data.message ?? "Error";
        break;
      case 500:
        open = true;
        message = "Internal Server Error";
        break;

      case 503:
        open = true;
        message = "Service Unavailable";
        break;
    }
    userStore.setSnackBar({
      ...userStore.snackBar,
      open: open,
      message: message,
      alert: {
        severity: severity,
      },
    });
    return Promise.reject(error);
  }
);

export default observer(axiosClient);
