import type { AlertProps, SnackbarProps } from "@mui/material";
import { makeAutoObservable } from "mobx";

interface UserProps {
  name: string;
}

class UserStore {
  user: UserProps | null = {
    name: "",
  };
  token: string | null = "";

  snackBar = {
    ...({
      open: false,
      message: "",
      vertical: "bottom",
      horizontal: "left",
    } as SnackbarProps),
    alert: {
      variant: "filled",
      severity: "success",
    } as AlertProps,
  };

  sessionMessage = "";

  constructor() {
    makeAutoObservable(this);
  }

  setUser = (user: UserProps | null) => {
    this.user = user;
  };

  setToken = (token: string | null) => {
    this.token = token;
  };

  setSnackBar = (snackBar: SnackbarProps | any) => {
    this.snackBar = snackBar;
  };

  setSessionMessage = (message: string) => {
    this.sessionMessage = message;
  };
}

export const userStore = new UserStore();
